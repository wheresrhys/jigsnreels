JNR.views.TuneList = Backbone.View.extend(_.extend({}, Backbone.Events, {
//
    events: $.extend({},JNR.views.Tune.prototype.events, {
		"click .expand"	: "expand",
//		"click thead th ": "sort",
		"click .view-switch": "viewSwitch",
//		"click .new ": "newTune",
		"keyup .filter" :  "filterTunes",
		"keyup .search" :  "searchTunes"
    }),

	getTemplates: function () {
		this.template = Handlebars.compile($('#tune-list-template').html());
		delete this.getTemplates;
	},
	
    initialize: function() {
		var that = this,
			masteredTuneCount,
			onceMasteredTuneCount,
			tuneCount;
			
		if (JNR.app.instrumentId) {
			masteredTuneCount = _.filter(JNR.app.tuneBook, function (model) {
				return model.get('standard') > 2;
			}).length;
			onceMasteredTuneCount = _.filter(JNR.app.tuneBook, function (model) {
				return model.get('best') > 2;
			}).length;
			tuneCount = JNR.app.tuneBook.length;
		} else {
			onceMasteredTuneCount = masteredTuneCount = tuneCount = 0;
			JNR.app.allTunes.each(function (model) {
				var performances = model.get('performances').models.slice(),
					performance;
				if (performances.length) {
					tuneCount++;
					while (performance = performances.shift()) {
						if (performance.get('standard') > 2) {
							onceMasteredTuneCount++;
							masteredTuneCount++;
							break;
						}
						if (performance.get('best') > 2 ) {
							onceMasteredTuneCount++;
						}
					}
				}
			});
		}
		
		this.$el.html(this.template({
			instrument: JNR.app.instrumentName || 'All instruments',
			tuneCount: tuneCount,
			masteredTuneCount: masteredTuneCount,
			onceMasteredTuneCount: onceMasteredTuneCount
		}));
		this.$tbody = this.$el.find("tbody");
		this.sortCol = "practiceUrgency";
		this.tuneBook = JNR.app.tuneBook;
		this.addDummyPerformance();
		that.sort();
		
		//that.list.on('add', this.addOne, this);
	
		this.$el.find(".filter, .search").val("");
		this.$modeFilter = this.$el.find(".filter[data-datum=mode]");
		this.$rhythmFilter = this.$el.find(".filter[data-datum=rhythm]");
		this.$rootFilter = this.$el.find(".filter[data-datum=root]");
		
		return this;
    },
	
	render: function() {
    },
	
	addOne: function(performance, prepend) {
		var view = new JNR.views.ClosedTune({
			model: performance,
			events: false
		}),
		that = this;
		this.$tbody[prepend === true ? "prepend" : "append"](view.render().el);
		this.on('edit:' + performance.cid.substr(1), view.edit, view);
		this.on('editText:' + performance.cid.substr(1), view.editText, view);
		this.on('expand:' + performance.cid.substr(1), view.expand, view);
		this.on('abcTidied:' + performance.cid.substr(1), view.abcTidied, view);
		performance.off("practiced");
		performance.on("practiced", function() {
			if(!that.filtered) {
				view.removeSlowly(function() {
					if (that.sortCol === 'sortRank') {
						if (!that.filteredTunes.length) {
							that.addDummyPerformance();
						}
					} else {
						that.filteredTunes.push(performance);
					}
					that.addOne(that.filteredTunes.shift());	
				});
				
			}
		});
    },
	addAll: function(filter, sorter) {
		var list, i, il;
		this.empty();
		this.filteredTunes = this.tuneBook;


		if (this.sortCol === 'unrated' || this.sortCol === 'sortRank' && this.filtered) {
			this.addDummyPerformance(1000);
			this.filteredTunes = _.filter(this.filteredTunes, filter);
			il = this.filteredTunes.length;
		} else {


			if (filter) {
				this.filteredTunes = _.filter(this.filteredTunes, filter);
			}
			if (sorter) {
				this.filteredTunes = _.sortBy(this.filteredTunes, sorter);
			}
			if (this.sortCol === 'sortRank') {
				if (this.filteredTunes.length < 25) {
					this.addDummyPerformance(25 - this.filteredTunes.length);
				}
				il = 25;
			} else {
				il = Math.min(15, this.filteredTunes.length);
			}

			
		}


		
		 
		
		for (i=0;i<il;i++) {
			this.addOne(this.filteredTunes.shift());
		}
		
    },
	
	addDummyPerformance: function (number) {

		var that = this,
			performances;
		if (!this.dummiesFetched) {
			setTimeout(function () {
				performances = JNR.app.allTunes.getDummyPerformances(JNR.app.allTunes.length);

				that.tuneBook = that.tuneBook.concat(performances);
				that.dummiesFetched = true;
			}, 1)
		}
		// var performances = JNR.app.allTunes.getDummyPerformances(number || 1);
		
		// this.filteredTunes = this.filteredTunes.concat(performances);
	},
	edit: function (ev) {
		 this.trigger('edit:' + $(ev.target).closest('tr').data("cid").substr(1), ev);
	},
	editText: function (ev) {
		 this.trigger('editText:' + $(ev.target).closest('tr').data("cid").substr(1), ev);
	},

	empty: function () {
		this.$tbody.empty();
		this.off();//'edit editText expand abcTidied');
	},
	
	expand: function (ev) {
		 this.trigger('expand:' + $(ev.target).closest('tr').data("cid").substr(1), ev);
	},
	destroy: function () {
		this.undelegateEvents();
		this.$el.empty();
	},
	sort: function () {
		var that = this;
		this.addAll(function (model) {
			if (that.sortCol == "sortRank") {
				return model.get("best") < 3 && !model.get("special_attention");
			} else if (that.sortCol == "practiceUrgency") {
				return model.get("best") > 2 || model.get("special_attention");
			} else if (that.sortCol == "unrated") {
				return model.get("tune").get('rating') < 1;
			}
		} , function (model) {
			return - model.get(that.sortCol);
		});

		$("input").filter(".search, .filter").val("");
		
	},
	viewSwitch: function (ev) {
		var $target = $(ev.target);
			ev.preventDefault();
			this.filtered = false;
		if ($target.is('.newTunes')) {
			this.sortCol = 'sortRank';
			this.sort();
		} else if ($target.is('.practice')) {
			this.sortCol = 'practiceUrgency';
			this.sort();
		} else if ($target.is('.unrated')) {
			this.sortCol = 'unrated';
			this.sort();
		}

	},
//	reSortForPractice: function () {
//		if(!this.filtered) {
//			var that = this;
//			setTimeout(function () {
//				that.sort();
//			},1);
//		}
//	},
	searchTunes: (function () {
		
		var that,
			debouncedFilter = $.debounce( 250,  function (val, datum) {
				var list;

				if (val) {
					
					if(JNR.app.instrumentId) {
						list = _.filter(JNR.app.allTunes.models, function (model) {
	//						var models = model.get('performances').models;
	//						if (!models.length) return false;
	//						if (LiquidMetal.score(model.get(datum), val) > 0.5) {
	//							var performances = _.map(model.get('performances').models, function (model) {
	//								model.get('instrument_id')
	//							});
	//							if (performances.indexOf(JNR.app.instrumentId) > -1) {
	//								return true;
	//							}
	//							return false
	//						};
							return LiquidMetal.score(model.get(datum), val) > 0.5; 
						});
						list = _.map(list, function (model) {
							var performance,
								performances = model.get('performances').models;

								_.each(performances, function(model) {

									if (model.get('instrument_id') === JNR.app.instrumentId) {
										performance = model;
									}
								});
								if (!performance) {
									performance = JNR.app.allTunes.getDummyPerformance(model);
								}
							return performance;
						});
					} else {
						list = [];
					}
					
					that.filtered = true;
					that.empty();
					list.each($.proxy(that, "addOne"));
				} else {
					that.filterTunes();
				}
				
			});
		
		return function (ev) {
			that = this;
			debouncedFilter(ev.target.value, $(ev.target).data("datum"));
		}
		
	}()),
	filterTunes: (function () {
		
		var that,
			debouncedFilter, 
			filter = function () {
				var list,
					tests = {
						mode: function (model, str) {
							return !(str && LiquidMetal.score(model.get('tune').get("mode"), str) < 0.5);
						},
						rhythm: function (model, str) {
							return !(str && LiquidMetal.score(model.get('tune').get("rhythm"), str) < 0.5);
						},
						root: function (model, str) {
							return !(str && str.toLowerCase().indexOf(model.get('tune').get("root").toLowerCase()) === -1);
						}
					},
					vals = {
						mode: that.$modeFilter.val(),
						rhythm: that.$rhythmFilter.val(),
						root: that.$rootFilter.val()
					},
					key;
					
					for (key in vals) {
						if (vals[key].indexOf('!') === 0) {
							vals[key] = vals[key].substr(1);
							(function () {
								var old = tests[key];
								tests[key] = function (model, str) {
									return !old(model, str);
								}
							}())
						} else if (vals[key].indexOf('|') > -1) {
							vals[key] = vals[key].split('|');

							(function () {
								var old = tests[key],
									istart = vals[key].length - 1;

								tests[key] = function (model, vals) {
									for (var i = istart; i >= 0; i--) {
										if (old(model, vals[i])	) {
											return true;
										}		
									}
									return false
								}
							}())
						}
					}
					
					//that.empty();
					$(".search").val("");
		
				if (vals.mode || vals.rhythm || vals.root) {
					that.filtered = true;
					that.addAll(function (model) {
						return tests.mode(model, vals.mode) && tests.rhythm(model, vals.rhythm) && tests.root(model, vals.root);
					})
				} else {
					that.filtered = false;
					that.sort();
				}
				
			};
		
		debouncedFilter = $.debounce(250, filter);
		
		return function (ev) {
			that = this;
			debouncedFilter();
		}
		
	}())	
}));
	
	
//	addNew: function (tune) {
//		this.list.add(tune);
//	},
//    
//	
//	newTune: function (ev) {
//		ev.preventDefault();
//		var model = this.list.at(0).toJSON(),
//			that = this;
//		for (var key in model) {
//			//A fairly safe generic default value as can be coerced to act like  astring
//			model[key] = 0;
//		}
//		model.id = undefined;
//		model = new JNR.models.Tune(model);
//		
//		model.save({});
//		that.addOne(model, true);
//		//this.trigger('expand:' + model.cid, ev);
//	},
