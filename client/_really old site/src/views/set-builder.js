 // Our overall **AppView** is the top-level piece of UI.
  JNR.views.SetBuilder = Backbone.View.extend({
	  
		getTemplates: function () {
			this.template = Handlebars.compile($('#set-builder-template').html())
			delete this.getTemplates;
		},	
		
		events: {
			"click .new" : "buildSet",
			"click .view-switch": "viewSwitch"
		},
		
		viewSwitch: function (ev) {
			var $target = $(ev.target);
				ev.preventDefault();
			if ($target.is('.best')) {
				$target.removeClass("best").html('Go to currently excellent tunes view');
				this.filter = 'best';
			} else {
				$target.addClass("best").html('Go to all tunes view');
				this.filter = 'standard';
			}
			this.setAllTunes();
			this.buildSet();
		},
		setAllTunes: function () {
			var that = this;
			this.playableTunes = _.filter(JNR.app.tuneBook, function (model, index) {
				return model.get(that.filter) > 2 ;
			});
		},
		initialize: function () {
			var that = this;
				that.$el.html(this.template({
					instrument: JNR.app.instrumentName
				}));
				this.filter = 'best';
				that.$view = $('#viewer');
				that.setAllTunes();
				that.buildSet();
			
			//record how much swing I like to play with
			// choose based on time signature and swing alone
			//default reels to 2 swing, hornpipes to 4
			// also a tempo option
		},
		
		destroy: function () {
			this.undelegateEvents();
			this.$el.empty();
		},
		addOne: function(performance, prepend) {
			var view = new JNR.views.ClosedTune({
				model: performance,
				events: false
			});
			this.$view[prepend === true ? "prepend" : "append"](view.render().el);
			this.on('edit:' + performance.cid.substr(1), view.edit, view);
			this.on('editText:' + performance.cid.substr(1), view.editText, view);
			this.on('expand:' + performance.cid.substr(1), view.expand, view);
			this.on('abcTidied:' + performance.cid.substr(1), view.abcTidied, view);
		},
		buildSet: function (ev) {
			var type = "reel,jig,hornpipe,slip jig,polka,slide".split(",")[Math.floor(Math.random()*4)],
				length = Math.ceil(Math.random()*3) + 1,
				suitableTunes = _.filter(this.playableTunes, function(model) {
					return (model.get('tune').get("rhythm").indexOf(type) === 0);
				}),
				totalTunes = suitableTunes.length,
				set = [],
				usedIndices = [],
				seenIndices = [],
				index,
				tune;
			
				set = _.first(_.sortBy(suitableTunes, function() {
					return Math.random();
				}), length);
			this.$view.empty();
			set.each($.proxy(this, "addOne"));
			ev && ev.preventDefault();
			
			
		}

  });
  

  




