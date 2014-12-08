var angular = require('angular'),
	_ = require('lodash');

// require('src/tune/services/abc-parser');

require('angular').module('jnr.tune').factory('jTune', function(
	$routeParams,
	$rootScope,
	jDatabase
) {

	var dayLength = (1000 * 60 * 60 * 24);

	var Tune = function(tune, opts) {
		this.tune = tune;
		this.opts = opts || {};
		this.init();
	};

	Tune.extract = function(tune, opts, instanceOpts) {
		var jTunes = [],
			filter;

		opts = opts || {};
		instanceOpts = instanceOpts || {};

		if (opts.performanceFilter) {
			jTunes = _.filter(tune.performances, opts.performanceFilter).map(function(performance) {
				return new Tune(tune, angular.extend({}, instanceOpts, {
					performance: performance
				}));
			});
		}

		if (!jTunes.length) {
			jTunes = [new Tune(tune, angular.extend({}, instanceOpts))];
		}


		if (opts.list) {
			Array.prototype.push.apply(opts.list, jTunes);
		}

		return jTunes;

	};

	Tune.create = function(data) {

		if (!(
			data.name &&
			data.abc &&
			data.root &&
			data.meter &&
			data.mode &&
			data.rhythm
		)) {
			return;
		}

		var performance,
			newTune = {
				sessionId: 0,
				name: data.name,
				arrangements: [{
					abc: data.abc,
					highestNote: '',
					lowestNote: '',
					variants: '',
					root: data.root,
					author: data.author || 'wheresrhys',
				}],
				alternativeNames: [],
				meter: data.meter,
				mode: data.mode,
				rhythm: data.rhythm,
				rating: data.rating || -1,
				popularity: data.popularity || -1,
				performances: [],
				notes: data.notes
			};

		if (data.performance.instrument) {
			performance = {
				standard: data.performance.standard || 0,
				notes: '',
				best: data.performance.standard || 0,
				difficulty: data.performance.difficulty || (-1),
				lastPracticed: data.performance.standard ? new Date() : new Date(0),
				special: !! data.performance.special,
				instrument: data.performance.instrument
			};
		}

		jDatabase.getResource('tunes').save(newTune, function(tune) {
			if (performance) {
				performance.arrangement = tune.arrangements[0]._id;
				performance.tune = tune._id;
				tune.performances.push(performance);
				tune.$update();
			}
			jDatabase.getTable('tunes').push(tune);
		});

		return true;
	};
	/* istanbul ignore next */
	Tune.getForArrangement = function(arrangement, instrument) {
		var tunesTable = jDatabase.getTable('tunes');
		var tune = _.findWhere(tunesTable, {
			_id: arrangement.tune
		});

		return new Tune(tune, {
			performance: _.findWhere(tune.performances, {
				arrangement: arrangement._id,
				instrument: instrument
			})
		});
	};

	Tune.prototype = {
		init: function() {
			// if (this.opts.scope) {
			//	 // if (typeof this.opts.scope === 'boolean') {
			//	 //	 $scope.tune = this;
			//	 //	 this.$scope = $scope;
			//	 // } else {
			//	 this.scope = this.opts.scope;
			//	 this.scope.tune = this;
			//	 // }
			// }

			this._assignArrAndPerf();
			this._setLastPracticedDays();
			this.opts.modifier && this.opts.modifier(this);
		},
		_assignArrAndPerf: function() {
			var that = this,
				defaultArrangement = this.tune.arrangements[0];
			if (this.opts.performance) {
				this.performance = this.opts.performance;
				this.arrangement = _.find(this.tune.arrangements, function(arrangement) {
					return arrangement._id === that.performance.arrangement;
				});
			} else {
				this.performance = {
					dummy: true
				};
				this.arrangement = defaultArrangement;
			}

			this.updateScore();
		},

		updateScore: function() {
			this.scoreGenerator = {
				arrangement: this.arrangement,
				meter: this.tune.meter,
				mode: this.tune.mode
			};
		},

		_setLastPracticedDays: function() {
			var milliseconds = ((new Date()) - (new Date(this.performance.lastPracticed || 0)));
			this.daysSinceLastPractice = +Math.round((milliseconds / dayLength), 0);
		},

		_performanceNeedsSaving: function(performance) {
			if (this.dummyStandard > -1) {
				return true;
			}
			for (var key in performance) {
				if (['instrument', 'dummy'].indexOf(key) === -1 && performance.hasOwnProperty(key)) {
					return true;
				}
			}
			return false;
		},
		_performanceIsReal: function(performance) {
			return !performance.dummy;
		},

		_createPerformance: function(performance) {
			performance = performance || {};
			return {
				tune: this.tune._id,
				instrument: (performance && performance.instrument) || $rootScope.pageState.instrument,
				special: performance.special || false,
				lastPracticed: new Date(0),
				difficulty: performance.difficulty || -1,
				best: 0,
				notes: '',
				standard: 0,
				arrangement: this.arrangement._id
			};
		},

		_updatePerformance: function(opts) {

			var practiced = false,
				performance = opts.performance || this.performance;
			if (this._performanceNeedsSaving(performance)) {

				if (!this._performanceIsReal(performance)) {
					performance = this._createPerformance(performance);
					this.tune.performances.push(performance);
				}

				if (this.dummyStandard > -1) {
					if (this.dummyStandard > 2) {
						performance.special = false;
					}
					performance.standard = this.dummyStandard;
					this.dummyStandard = -1;
					performance.lastPracticed = new Date();
					this._setLastPracticedDays();
					$rootScope.$broadcast('tunePracticed', this);
					practiced = true;

				}
				performance.best = Math.max(performance.best, performance.standard);

				if (opts.setPublicPerformance) {
					this.performance = performance;
				}

			}
			return practiced;
		},
		isNew: function() {
			return this.tune.rating < 0; // || tune.popularity < 0;
		},
		resetArrangement: function() {
			var testId = this.performance.arrangement;
			this.arrangement = _.find(this.tune.arrangements, function(arrangement) {
				return arrangement._id === testId;
			});
			this.arrangementChangePending = false;
			this.updateScore();
		},

		nextArrangement: function() {
			this.arrangement = this.tune.arrangements[(this.tune.arrangements.indexOf(this.arrangement) + 1) % this.tune.arrangements.length];
			this.arrangementChangePending = (this.arrangement._id !== this.performance.arrangement);
			this.updateScore();
		},

		update: function(opts) {
			opts = opts || {};

			var that = this,
				oldProps = opts.oldProps || {},
				practiced = this._updatePerformance(opts);

			if (oldProps && oldProps.rating === -1 && !this.isNew()) {
				$rootScope.newTuneCount--;
			}

			if (opts.arrangement) {
				this.tune.arrangements.push(opts.arrangement);
				if (opts.arrangement._id) {
					delete opts.arrangement._id;
				}
				opts.arrangement.tune = this.tune._id;
				this._sync(function(savedTune) {
					if (opts.useArrangement) {
						that.updateScore();
						that.arrangement = savedTune.arrangements[savedTune.arrangements.length - 1];
						that.performance.arrangement = that.arrangement._id;
						that._sync();
					}
				});
				this.arrangementChangePending = false;

			} else {
				this._sync();
			}

			if (opts.arrangement || opts.updateScore) {
				this.updateScore();
			}

			return {
				practiced: practiced
			};
		},

		_sync: function(callback) {
			var that = this,
				performanceIndex = this.tune.performances.indexOf(this.performance),
				arrangementIndex = this.tune.arrangements.indexOf(this.arrangement);

			this.tune.$update(function(savedTune) {
				that.performance = that.tune.performances[performanceIndex];
				that.arrangement = that.tune.arrangements[arrangementIndex];
				callback && callback(savedTune);
			});
		}

	};

	return Tune;

});