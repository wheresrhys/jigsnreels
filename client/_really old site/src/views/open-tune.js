JNR.views.OpenTune = JNR.views.Tune.extend({

    getTemplates: function() {
		this.template = Handlebars.compile($('#open-tune-template').html());
		delete this.getTemplates;
	},

    // The DOM events specific to an item.
    events: $.extend({},JNR.views.Tune.prototype.events, {
		"click .hide" :	"hide",
		"click .render": "showScore",
		"click .delete": "delete"
    }),

    // The TodoView listens for changes to its model, re-rendering.
    initialize: function(options) {
		this.model = options.model;
		this.render();
    },
	"delete" : function(ev) {
		ev.preventDefault();
		 
		 var that = this,
			mode = $(ev.target).data('mode'),
			confirm = ui.confirm('Delete tune', 'Are you sure you want to delete the ' + 
				((mode === 'tune') ? 'tune and All its performances' : 'performance')  + 
				' ' + this.model.get('tune').get("long_name") + '?')
			.ok('Yes, go ahead')
			.overlay()
			.cancel('No dont!')
			.show(function(ok){
				that.hide();
				if (mode === 'tune') {
					that.model.get('tune').reallyDestroy();
				} else {
					that.model.destroy();
				}
			});
		
	},
	
	render: function () {
		$(this.el).html(this.template($.extend(this.model.toJSON(true))));
		$(this.el).add("#open-tune-overlay").fadeIn();
		//if (this.model.get('best') < 3) {
			this.showScore();
		//}
	},
	
	showScore: function (ev) {
		ev && ev.preventDefault();
		var $container = $(this.el).find(".score").empty().css("width", "");
		var type = ev ? $(ev.target).data("abc_type") : 'my';
		var abc = (type ==="my") ? this.model.get("my_abc") : this.model.get('tune').get('session_abc');
		if (type === "my" && !(abc.indexOf("X:") > -1)) {
			abc = "X:1" +
				"\nT:" + this.model.get('tune').get("long_name") + 
				"\nM:" + this.model.get('tune').get("meter") + 
				"\nL:1/8" + 
				"\nR:" + this.model.get('tune').get("rhythm") + 
				"\nK:" + this.model.get('tune').get("root") + this.model.get('tune').get("mode") + "\n" + abc;
		}
//		var tunebook = new AbcTuneBook(abc);
//		var abcParser = new AbcParse();
//		abcParser.parse(tunebook.tunes[0].abc, {warnings_id: "warnings" }); //TODO handle multiple tunes
//		var tune = abcParser.getTune();
//		
//		var paper = Raphael($container[0], $container.width(), 400);
//		var printer = new ABCPrinter(paper, {
//			scale: 	0.9 * $container.width()/800,
//			staffwidth: 	0.9 * $container.width()
//		});      // TODO: handle printer params
//		printer.printABC(tune);
		
		
		renderAbc($container[0], abc, {}, {
			scale: 	0.9 * $container.width()/800,
			staffwidth: 	0.9 * $container.width()
		}, {});
		
		
	},
	
	
	hide: function () {
		this.$el.empty().add("#open-tune-overlay").fadeOut();
		this.undelegateEvents();
		return false;
	}

  });