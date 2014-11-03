JNR.views.ClosedTune = JNR.views.Tune.extend({

    tagName:  "tr",

	getTemplates: function () {
		this.template = Handlebars.compile($('#closed-tune-template').html());
		delete this.getTemplates;
	},

	events: {},

	initialize: function (options) {
		if (this.model) {
			this.model.on('change', this.render, this);
			this.model.on('rankingChanged', this.reRank, this);
			this.model.on('destroy', this.remove, this);
		
		} else {
			console.log(this);
		}
    },
	reRank: function (rank) {
		this.$el.data({
					rank: this.model.get("rank"),
					urgency: this.model.get("practiceUrgency")
				});
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON(true)))
				.data({
					cid: this.model.cid,
					rank: this.model.get("rank"),
					urgency: this.model.get("practiceUrgency")
				}).attr('class','instrument' + this.model.get('instrument_id'));
		if (!this.model.get('my_abc')) {
			this.$el.addClass("incomplete");
		} else if(this.model.get('my_abc').indexOf("X:") > -1) {
			this.$el.addClass("messy-abc");
		}

		if (this.model.get('tune').get('performances').filter(function (performance) {
								return (performance.get('best') > 2) && (performance.get('instrument_id') != JNR.app.instrumentId);
							}).length === 0) {
			this.$el.addClass("no-performance");
		}
		
		return this;
    },
	abcTidied: function () {
		this.$el.removeClass("messy-abc");
	},
	removeSlowly: function (callback) {
//		this.$el.add(this.$el.children()).animate({
//			opacity: 0,
//			height: 0
//		},function () {
//			$(this).remove();
//		});
		this.$el.fadeOut(function () {
			$(this).remove();
			callback();
		});
	},
    // Remove this view from the DOM.
    remove: function() {
		this.$el.remove();
    },
	
	expand : function(ev) {
		ev && ev.preventDefault();
		new JNR.views.OpenTune({
			el: $("#open-tune"),
			model: this.model
		});
	}

  });