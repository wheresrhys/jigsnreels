describe('services/tune', function () {

	var tune,
		$rootScope,
		jTune,
		tuneResource,
		jDatabase;

	beforeEach(angular.mock.module('jnr'));

	beforeEach(inject(function($injector) {
		$rootScope = $injector.get('$rootScope');
		$rootScope.pageState = {
			instrument: 'instrument1'
		};
		jTune = $injector.get('jTune');
		jDatabase = tuneResource = $injector.get('jDatabase');
		tuneResource = jDatabase.getResource('tunes');

	}));

	describe('static methods', function () {
		describe('extract', function () {
			beforeEach(function () {
				tune = Helpers.getValidTunes(1, {
					performances: [
						{name: 'yes'},
						{name: 'no'},
						{name: 'yes'}
					]
				})[0];
			});

			it('should return the list of jTunes created', function () {
				var tunes = jTune.extract(tune);
				expect(tunes).toBeAnArray();
			});

			it('should create jTune with dummy performance when no filter provided', function () {
				var tunes = jTune.extract(tune);
				expect(tunes.length).toBe(1);
				expect(tunes[0].performance.dummy).toBeTruthy();
			});

			it('should only create jTune for those performances matching a given filter', function () {
				var tunes = jTune.extract(tune, {
					performanceFilter: function (item) {
						return item.name === 'yes';
					}
				});
				expect(tunes.length).toBe(2);
			});

			it('should create jTune with dummy performance when no performances match the filter', function () {
				var tunes = jTune.extract(tune, {
					performanceFilter: function (item) {
						return item.name === 'maybe';
					}
				});
				expect(tunes.length).toBe(1);
				expect(tunes[0].performance.dummy).toBeTruthy();
			});

			it('should append the jTunes created to a given list', function () {
				var list = [],
					tunes = jTune.extract(tune, {
						list: list
					});

				expect(list.length).toBe(1);
			});

			it('should pass any options into instances', function () {
				spyOn(jTune.prototype, 'init').andCallFake(function () {
					expect(this.opts.dummyProp).toBe('dummy');
				});
				jTune.extract(tune, null, {
					dummyProp: 'dummy'
				});
			});

		});

		describe('create', function () {
			var validTuneData;

			beforeEach(function () {
				validTuneData = {
					name: 'test name',
					abc: 'test abc',
					root: 'test root',
					meter: 'test meter',
					mode: 'test mode',
					rhythm: 'test rhythm',
					rating: 'test rating',
					popularity: 'test popularity',
					notes: 'test notes',
					performance: {}
				};

				spyOn(tuneResource, 'save').andCallFake(function (data, callback) {
					data = angular.extend({_id: 'aTuneId'}, data);
					data.arrangements[0]._id = 'anArrangementId';
					data.$update = jasmine.createSpy('tune update');
					callback(data);
				});

				var allTunes = [];
				jDatabase.getTable = function (name) {
					if (name === 'tunes') {
						return allTunes;
					}
				};
			});

			describe('not saving invalid tunes', function () {
				var required = ['name', 'abc', 'root', 'meter', 'mode', 'rhythm'];

				function requiredTest (field) {
					it('should require a ' + field, function () {
						validTuneData[field] = null;
						expect(jTune.create(validTuneData)).toBeFalsy();
						expect(tuneResource.save).not.toHaveBeenCalled();
					});
				}
				for(var i = 0, il = required.length; i<il; i++) {
					requiredTest(required[i]);
				}
			});
			describe('saving a valid tune', function () {
				it('should save a valid tune successfully', function () {
					expect(jTune.create(validTuneData)).toBeTruthy();
					expect(tuneResource.save).lastCalledWith({
						sessionId: 0,
						name: 'test name',
						arrangements: [{
							abc: 'test abc',
							highestNote: '',
							lowestNote: '',
							variants: '',
							root: 'test root',
							author: 'wheresrhys',
						}],
						alternativeNames: [],
						meter: 'test meter',
						mode: 'test mode',
						rhythm: 'test rhythm',
						rating: 'test rating',
						popularity: 'test popularity',
						performances: [],
						notes: 'test notes'
					});
				});
				it('should append to the table of all tunes', function () {
					jTune.create(validTuneData);
					expect(jDatabase.getTable('tunes').length).toBe(1);
				});

				describe('saving with a performance', function () {
					it('should save a performance if required', function () {
						validTuneData.performance = {
							instrument: 'test instrument',
							standard: 3,
							difficulty: 1,
							special: true
						};

						jTune.create(validTuneData);
						expect(tuneResource.save).lastCalledWith({
							sessionId: 0,
							name: 'test name',
							arrangements: [{
								abc: 'test abc',
								highestNote: '',
								lowestNote: '',
								variants: '',
								root: 'test root',
								author: 'wheresrhys',
							}],
							alternativeNames: [],
							meter: 'test meter',
							mode: 'test mode',
							rhythm: 'test rhythm',
							rating: 'test rating',
							popularity: 'test popularity',
							notes: 'test notes',
							performances: []
						});
						var tune = jDatabase.getTable('tunes')[0];
						var lastPracticed = tune.performances[0].lastPracticed;
						delete tune.performances[0].lastPracticed;
						expect(tune.performances).toEqual([{
							standard: 3,
							notes: '',
							best: 3,
							difficulty: 1,
							special: true,
							instrument: 'test instrument',
							arrangement: 'anArrangementId'
						}]);
						expect(lastPracticed).toBeSameTimeAs(new Date());
						expect(tune.$update).toHaveBeenCalled();
					});

					it('should use default values for certain fields', function () {
						validTuneData.performance.instrument = 'test instrument';
						validTuneData.rating = '',
						validTuneData.popularity = '',
						jTune.create(validTuneData);
						expect(tuneResource.save).lastCalledWith({
							sessionId: 0,
							name: 'test name',
							arrangements: [{
								abc: 'test abc',
								highestNote: '',
								lowestNote: '',
								variants: '',
								root: 'test root',
								author: 'wheresrhys',
							}],
							alternativeNames: [],
							meter: 'test meter',
							mode: 'test mode',
							rhythm: 'test rhythm',
							rating: -1,
							popularity: -1,
							performances: [],
							notes: 'test notes'
						});
						var tune = jDatabase.getTable('tunes')[0];
						var lastPracticed = tune.performances[0].lastPracticed;
						delete tune.performances[0].lastPracticed;
						expect(tune.performances).toEqual([{
							standard: 0,
							notes: '',
							best: 0,
							difficulty: -1,
							special: false,
							instrument: 'test instrument',
							arrangement: 'anArrangementId'
						}]);
						expect(lastPracticed).toBeSameTimeAs(new Date(0));
						expect(tune.$update).toHaveBeenCalled();
					});
				});
			});

		});

		describe('getForArrangement', function () {

		});
	});

	describe('instances', function () {

		beforeEach(function () {
			tune = Helpers.getValidTunes(1)[0];
			tune.performances = [];
			tune.arrangements = [{_id: 'arrId1', root: 'G'}, {_id: 'arrId2', root: 'B'}];
		});

		describe('init', function () {

			it('should set the number of days since last practice', function () {
				spyOn(jTune.prototype, '_setLastPracticedDays').andCallThrough();
				tune = new jTune(tune);
				expect(jTune.prototype._setLastPracticedDays).toHaveBeenCalled();
				expect(jTune.prototype._setLastPracticedDays.mostRecentCall.object).toBe(tune);
			});

			it('should assign performance and arrangement', function () {
				spyOn(jTune.prototype, '_assignArrAndPerf').andCallThrough();
				tune = new jTune(tune);
				expect(jTune.prototype._assignArrAndPerf).toHaveBeenCalled();
				expect(jTune.prototype._assignArrAndPerf.mostRecentCall.object).toBe(tune);
			});

		});



		describe('functionality', function () {

			beforeEach(function () {
				tune = new jTune(tune);
			});

			describe('_assignArrAndPerf', function () {
				it('should create dummy when no performance defined in the options', function () {
					expect(tune.performance).toEqual({
						dummy: true
					});
					expect(tune.arrangement._id).toBe('arrId1');
				});
				it('should use any performance defined in the options', function () {
					var perf = {
						arrangement: 'arrId2'
					};
					tune.opts.performance = perf;
					tune._assignArrAndPerf();
					expect(tune.performance).toBe(perf);
					expect(tune.arrangement._id).toBe('arrId2');
				});
			});

			describe('_setLastPracticedDays', function () {
				it('should calculate the gap when no date given', function () {
					var daysSinceZero = +Math.round(((new Date()) / (1000 * 60 * 60 * 24)), 0);
					tune.performance.lastPracticed = null;
					tune._setLastPracticedDays();
					expect(typeof tune.daysSinceLastPractice).toBe('number');
					expect(tune.daysSinceLastPractice).toBe(daysSinceZero);
				});

				it('should calculate teh gap when a date given', function () {
					var date = new Date();
					date = date.setDate(date.getDate() - 1);
					tune.performance.lastPracticed = date;
					tune._setLastPracticedDays();
					expect(typeof tune.daysSinceLastPractice).toBe('number');
					expect(tune.daysSinceLastPractice).toBe(1);
				});
			});

			describe('_performanceNeedsSaving', function () {
				it('should pass tunes that have dummy standard set', function () {
					var performance = {};
					tune.dummyStandard = -1;
					expect(tune._performanceNeedsSaving(performance)).toBeFalsy();
					tune.dummyStandard = 0;
					expect(tune._performanceNeedsSaving(performance)).toBeTruthy();
					tune.dummyStandard = 2;
					expect(tune._performanceNeedsSaving(performance)).toBeTruthy();
				});
				it('should pass tunes that have additional properties set in the performance', function () {
					var performance = {};
					expect(tune._performanceNeedsSaving(performance)).toBeFalsy();
					performance = {
						dummy: true,
						instrument: 'instrument'
					};
					expect(tune._performanceNeedsSaving(performance)).toBeFalsy();
					performance = {
						extraProp: true
					};
					expect(tune._performanceNeedsSaving(performance)).toBeTruthy();
				});
			});
			describe('_performanceIsReal', function () {
				it('should only pass dummy performances', function () {
					var performance = {};
					expect(tune._performanceIsReal(performance)).toBeTruthy();
					performance = {arr: 'dsf'};
					expect(tune._performanceIsReal(performance)).toBeTruthy();
					performance = {dummy: true};
					expect(tune._performanceIsReal(performance)).toBeFalsy();
				});
			});
			describe('isNew', function () {
				it('should only pass tunes tht are unrated', function () {
					tune.tune.rating = -1;
					expect(tune.isNew()).toBeTruthy();
					tune.tune.rating = 0;
					expect(tune.isNew()).toBeFalsy();
					tune.tune.rating = 2;
					expect(tune.isNew()).toBeFalsy();
				});
			});
			describe('resetArrangement', function () {
				it('should reassign the current performance\'s arrangement to the convenience property', function () {
					expect(tune.arrangement._id).toBe('arrId1');
					tune.performance = {
						arrangement: 'arrId2'
					};
					tune.arrangementChangePending = true;
					tune.resetArrangement();
					expect(tune.arrangement._id).toBe('arrId2');
					expect(tune.arrangementChangePending).toBeFalsy();
				});
			});




			describe('updating a tune', function () {

				describe('_updatePerformance', function () {

					describe('identifying when to create a performance', function () {
						it('should not create performance when no real data is being passed', function () {
							tune.performance = {
								dummy: true,
								instrument: 'instrument1'
							};
							tune._updatePerformance({});
							expect(tune.tune.performances.length).toBe(0);

						});

						it('should not create performance when already using a real performance', function () {
							tune.performance = tune.tune.performances[0] = {
								instrument: 'instrument1',
								difficulty: 3
							};
							tune._updatePerformance({});
							expect(tune.tune.performances.length).toBe(1);

						});

						it('should create performance when real data passed to a dummy performance', function () {
							tune.performance = {
								dummy: true,
								instrument: 'instrument1',
								difficulty: 3
							};
							tune.arrangement = 'arrId';
							tune._updatePerformance({});
							expect(tune.tune.performances.length).toBe(1);

						});
					});

					it('should save performance as a public property when requested', function () {
						var newPerf = {
							difficulty: 5
						};
						tune._updatePerformance({
							performance: newPerf,
							setPublicPerformance: true
						});
						expect(tune.performance).toBe(newPerf);

					});

					describe('when using an existing performance', function () {
						var performance;
						beforeEach(function () {
							performance = tune.performance = tune.tune.performances[0] = {
								instrument: 'perfInstrument',
								special: false,
								lastPracticed: new Date(),
								difficulty: 2,
								best: 4,
								notes: 'no notes',
								standard: 3,
								arrangement: 'arrId'
							};
						});




						describe('practicing', function () {
							it('should save practice info when dummy standard passed in', function () {
								tune.dummyStandard = 2;
								tune._updatePerformance({});
								expect(tune.tune.performances[0].standard).toBe(2);
								expect(tune.tune.performances[0].best).toBe(4);
								expect(tune.tune.performances[0].lastPracticed).toBeSameTimeAs(new Date());
							});

							it('should adjust best standard', function () {
								tune.dummyStandard = 5;
								tune._updatePerformance({});
								expect(tune.tune.performances[0].standard).toBe(5);
								expect(tune.tune.performances[0].best).toBe(5);
							});
							it('should reset dummy standard back to default value', function () {
								tune.dummyStandard = 5;
								tune._updatePerformance({});
								expect(tune.dummyStandard).toBe(-1);
							});

							it('should return whether the tune is practiced', function () {
								tune.dummyStandard = 5;
								var status = tune._updatePerformance({});
								expect(status).toBeTruthy();
								tune.difficulty = 3;
								status = tune._updatePerformance({});
								expect(status).toBeFalsy();
							});
						});

					});

					describe('when having to create a performance', function () {
						var performance;
						beforeEach(function () {
							tune.performance = {
								dummy: true,
								instrument: 'instrument1'
							};
						});

						it('should save full performance when new properties defined directly on performance', function () {
							tune.performance.difficulty = 3;
							tune._updatePerformance({});
							expect(tune.performance).not.toBe(tune.tune.performances[0]);
							expect(tune.tune.performances[0].difficulty).toBe(3);
							expect(tune.tune.performances[0].instrument).toBe('instrument1');
							expect(tune.tune.performances[0].special).toBe(false);
							expect(tune.tune.performances[0].lastPracticed).toBeSameTimeAs(new Date(0));
							expect(tune.tune.performances[0].difficulty).toBe(3);
							expect(tune.tune.performances[0].best).toBe(0);
							expect(tune.tune.performances[0].notes).toBe('');
							expect(tune.tune.performances[0].standard).toBe(0);
							expect(tune.tune.performances[0].arrangement).toBe('arrId1');

						});

						it('should get instrument from pageState if required', function () {
							$rootScope.pageState = {
								instrument: 'instrument2'
							};
							tune.performance = {
								dummy: true,
								difficulty: 3
							};
							tune._updatePerformance({});
							expect(tune.tune.performances[0].instrument).toBe('instrument2');
						});


						describe('practicing', function () {
							it('should save practice info when dummy standard passed in', function () {
								tune.dummyStandard = 2;
								tune._updatePerformance({});
								expect(tune.tune.performances[0].standard).toBe(2);
								expect(tune.tune.performances[0].best).toBe(2);
								expect(tune.tune.performances[0].lastPracticed).toBeSameTimeAs(new Date());
							});

							it('should reset dummy standard back to default value', function () {
								tune.dummyStandard = 5;
								tune._updatePerformance({});
								expect(tune.dummyStandard).toBe(-1);
							});

							it('should return whether the tune is practiced', function () {
								tune.dummyStandard = 5;
								var status = tune._updatePerformance({});
								expect(status).toBeTruthy();
								tune.difficulty = 3;
								status = tune._updatePerformance({});
								expect(status).toBeFalsy();
							});
						});
					});
				});

				describe('update', function () {
					beforeEach(function () {
						spyOn(tune, '_sync').andCallFake(function (callback) {
							callback && callback();
						});
					});

					it('should update the performance', function () {
						spyOn(tune, '_updatePerformance');
						tune.update();
						expect(tune._updatePerformance).toHaveBeenCalled();
					});

					it('should return whether the tune is practiced', function () {
						tune.dummyStandard = 5;
						var status = tune.update();
						expect(status.practiced).toBeTruthy();
						tune.performance.difficulty = 3;
						status = tune._updatePerformance({});
						expect(status.practiced).toBeFalsy();
					});

					describe('updating the global new tune count', function () {
						it('should update the newTuneCount only for change in rating', function () {
							$rootScope.newTuneCount = 1;
							$rootScope.showNewTunes = true;
							tune.tune.popularity = 1;
							tune.update();
							expect(tune._sync).toHaveBeenCalled();
							expect($rootScope.newTuneCount).toBe(1);
							tune.tune.rating = 1;
							tune.update({
								oldProps: {
									rating: -1
								}
							});
							expect(tune._sync).toHaveBeenCalled();
							expect($rootScope.newTuneCount).toBe(0);
						});

						it('should update the newTuneCount only once per tune', function () {
							$rootScope.newTuneCount = 1;
							tune.tune.rating = 1;
							tune.update({
								oldProps: {
									rating: -1
								}
							});
							expect(tune._sync).toHaveBeenCalled();
							expect($rootScope.newTuneCount).toBe(0);
							tune.tune.rating = 2;
							tune.update({
								oldProps: {
									rating: 1
								}
							});
							expect(tune._sync).toHaveBeenCalled();
							expect($rootScope.newTuneCount).toBe(0);
						});
					});

					describe('adding an arrangement', function () {
						beforeEach(function () {
							tune.tune.performances = [{
								_id: 'per1'
							}];
							tune.performance = tune.tune.performances[0];
							tune._sync.andCallFake(function (callback) {
								var newTune = angular.extend({}, tune.tune);
								newTune.arrangements[2]._id = newTune.arrangements[2]._id || 'newId';
								tune.tune = newTune;
								callback && callback(newTune);
							});
						});

						it('should allow adding an arrangement', function () {

							tune.update({
								arrangement: {abc: 'abc2'}
							});

							expect(tune.tune.arrangements.length).toBe(3);
							expect(tune.tune.arrangements[2].abc).toBe('abc2');
							expect(tune.tune.arrangements[2]._id).toBe('newId');

						});

						it('should remove id before sending new arrangement to server', function () {

							tune.update({
								arrangement: {abc: 'abc2', _id: 'test'}
							});
							expect(tune.tune.arrangements[2]._id).toBe('newId');

						});

						it('should allow adding an arrangement as the one used by a performance', function () {

							tune.update({
								arrangement: {abc: 'abc2'},
								useArrangement: true
							});


							expect(tune.performance.arrangement).toBe('newId');

						});

						it('should pass the update onto any parts of the ui generating a score', function () {

							tune.update({
								arrangement: {abc: 'abc2'},
								useArrangement: true
							});


							expect(tune.scoreGenerator.arrangement.abc).toBe('abc2');

						});
					});
				});


				describe('_sync', function () {
					beforeEach(function () {
						tune.tune.$update = jasmine.createSpy('tune update');
					});

					it('should call the tune\'s update method', function () {
						tune._sync();
						expect(tune.tune.$update).toHaveBeenCalled();
						expect(tune.tune.$update.calls.length).toBe(1);
					});

					it('should preserve convenient references to current arrangement and performance', function () {
						var arrs = [{aa:1}, {ba:2}, {ca:3}],
							perfs = [{ap:1}, {bp:2}, {cp:3}];

						tune.tune.performances = perfs;
						tune.tune.arrangements = arrs;
						tune.arrangement = arrs[2];
						tune.performance = perfs[1];
						tune.tune.$update.andCallFake(function (callback) {
							tune.arrangement = null;
							tune.performance = null;
							callback && callback();
						});

						tune._sync();
						expect(tune.performance).toBe(perfs[1]);
						expect(tune.arrangement).toBe(arrs[2]);
					});

					it('shoudl call any callback function passed to it', function () {
						var func = jasmine.createSpy();
						tune.tune.$update.andCallFake(function (callback) {
							callback && callback();
						});

						tune._sync(func);
						expect(func).toHaveBeenCalled();
					});
				});

			});
		});
	});
});
