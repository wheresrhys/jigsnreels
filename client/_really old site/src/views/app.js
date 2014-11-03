 // Our overall **AppView** is the top-level piece of UI.
  JNR.views.App = Backbone.View.extend({


    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "click #menu a":  "switchView",
	  "click #instruments a":  "switchInstrument"
    },

    initialize: function() {
		this.stats = JNR.data;
		this.updateFromTheSession();
		this.allTunes = new JNR.collections.TuneList();
		this.instruments = new JNR.collections.InstrumentList();
		this.allPerformances = new JNR.collections.PerformanceList();
    },
	
	start: function () {
		var that = this;
		that.allTunes.add(JNR.data.tunes);
		that.allPerformances.add(JNR.data.performances);
		that.allPerformances.properlyInitialise();
		that.routes = new JNR.ROUTES();
		Backbone.history.start({
			pushState : true
		});
	},
	
	switchView: function (ev) {
		ev.preventDefault();
		this.routes.navigate($(ev.target).attr("href") + '/' + this.instrumentName, {trigger: true});
	},
	
	switchInstrument: function (ev) {
		ev.preventDefault();
		this._setInstrument($(ev.target).attr("href"));
		this.routes.navigate(this.viewType + $(ev.target).attr("href"), {trigger: true});
	},
	
	_setInstrument: function (instrument) {
		var instrumentId;
		if (instrument) {
			instrumentId = JNR.app.instruments.where({name: instrument});
			if (instrumentId.length) {
				JNR.app.instrumentName = instrument;
				JNR.app.instrumentId = instrumentId[0].get('id');
				this.tuneBook = this.allPerformances.filter(function (model, index) {
					return model.get("instrument_id") == JNR.app.instrumentId;
				});
				return;
			}
		}
		
		JNR.app.instrumentName = '';
		JNR.app.instrumentId = 0;
		this.tuneBook = this.allPerformances.filter(function (model, index) {
			return true
		});
	},
	loadView: function (type) {
		this.viewType = type;
		this.currentView && this.currentView.destroy();
		if (type === "tunes") {
			this.currentView = new JNR.views.TuneList({el: $("#content")});
		} else if (type === "sets") {
			this.currentView = new JNR.views.SetList({el: $("#content")});
		} else if (type === "set-builder") {
			this.currentView = new JNR.views.SetBuilder({el: $("#content")});
		}
	},
	
	updateFromTheSession: function () {
		var that = this;
		$.ajax({
			url: "/rest/scraper",
			dataType: "json",
			success: function (tunes) {
				var i, 
					il;
					
				if (tunes.length) {
					for(i = 0, il = tunes.length; i<il; i++) {
						$.ajax({
							url: "/rest/scraper/"+ tunes[i].session_id,
							dataType: "json",
							success: function (json) {
								that.allTunes.add(new JNR.models.Tune(json));
							}
						})
					}
				} 
			}
		})
		
	},
	
    render: function() {

    }

  });


