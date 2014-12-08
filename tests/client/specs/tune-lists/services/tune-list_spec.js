describe('services/tune-list', function () {

	var $scope,
		$httpBackend,
		$rootScope,
		database,
		tuneListFactory,
		tuneList,
		tune,

		getTuneList = function (conf, instrument) {
			$rootScope.pageState = {
				instrument: instrument || 'instrument1'
			};
			tuneList = tuneListFactory(angular.extend({
				$scope: $scope
			}, conf));
		};

	beforeEach(angular.mock.module('jnr'));

	beforeEach(inject(function ($injector) {
		$rootScope = $injector.get('$rootScope');
		$scope = $rootScope.$new();
		$httpBackend = $injector.get('$httpBackend');
		Helpers.Server.addHttp($httpBackend);
		Helpers.Server.mockViews();
		Helpers.Server.mockScraper();
	}));

	var injectBeforeDB = function (func) {
		inject(func());
		inject(function (jTuneList) {
			tuneListFactory = jTuneList;
		});
	};


	describe('initialisation', function () {
		beforeEach(function () {
			injectBeforeDB(function () {
				$httpBackend.whenGET('/rest/tunes').respond(Helpers.getValidTunes(10));
			});
		});

		it('should wait for database to return when no data fetched already', function () {
			getTuneList();
			expect(tuneList.tuneCount).toBe(0);
			spyOn(tuneList, 'populateList');
			$httpBackend.flush();
			expect(tuneList.populateList).toHaveBeenCalled();
		});
		it('should not wait for database to return when data already fetched', function () {
			$httpBackend.flush();
			getTuneList();
			expect(tuneList.tuneCount).toBe(10);
		});
		describe('defining handler methods on the scope', function () {
			it('should attach default methods', function () {
				getTuneList();
				expect($scope.expandTune).toBeAFunction();
				expect($scope.update).toBeAFunction();
			});
			it('should be abel to override default methods', function () {
				var funcs = {
					expandTune: function () {},
					update: function () {}
				};
				getTuneList(funcs);
				expect($scope.expandTune).toBeThisFunction(funcs.expandTune);
				expect($scope.update).toBeThisFunction(funcs.update);
			});
		});

		describe('assigning the list to the scope', function () {

			it('should use the default name', function () {
				$httpBackend.flush();
				getTuneList();
				expect($scope.tunes).toBeAnArray();
			});

			it('should be possible to override the default name', function () {
				$httpBackend.flush();
				getTuneList({
					listName: 'testName'
				});
				expect($scope.tunes).toBeUndefined();
				expect($scope.testName).toBeAnArray();

			});
		});
	});

	describe('populating the list', function () {
		it('should emit an event', function () {
			injectBeforeDB(function () {
				$httpBackend.whenGET('/rest/tunes').respond(Helpers.getValidTunes(50));
			});
			$httpBackend.flush();
			spyOn($scope, '$emit');
			getTuneList();
			expect($scope.$emit).toHaveBeenCalled();
			expect($scope.$emit).lastCalledWith('tunesListed');

		});
		describe('sanitising tune properties', function () {
			it('should make sure arrangement and performance are suitably defined', function () {
				injectBeforeDB(function () {
					$httpBackend.whenGET('/rest/tunes').respond([
						{
							name: 'matchingArrangement',
							arrangements: [{_id: 'arrId1'}, {_id: 'arrId2'}],
							performances: [{
								arrangement: 'arrId1',
								instrument: 'instrument1',
								best: 3
							},
							{
								arrangement: 'arrId2',
								instrument: 'instrument2',
								best: 3
							}]
						},
						{
							name: 'noMatchingArrangement',
							arrangements: [{_id: 'arrId3'}],
							performances: [{
								arrangement: 'arrId1',
								instrument: 'instrument1',
								best: 3
							}]
						},
						{
							name: 'noMatchingArrangement',
							arrangements: [{_id: 'arrId1'}],
							performances: [{
								arrangement: 'arrId1',
								instrument: 'instrument3',
								best: 3
							}]
						}
					]);
				});
				$httpBackend.flush();
				getTuneList();
				expect($scope.tunes[0].performance.arrangement).toBe('arrId1');
				expect($scope.tunes[0].arrangement._id).toBe('arrId1');
				expect($scope.tunes[1].performance.arrangement).toBe('arrId1');
				expect($scope.tunes[1].arrangement).toBeFalsy();
				expect($scope.tunes[2].performance).toEqual({
					dummy: true
				});
				expect($scope.tunes[2].arrangement._id).toBe('arrId1');
			});

			it('should call any tune modifier function', function () {
				injectBeforeDB(function () {
					$httpBackend.whenGET('/rest/tunes').respond([
						{
							name: 'matchingArrangement',
							arrangements: [{_id: 'arrId1'}, {_id: 'arrId2'}],
							performances: [{
								arrangement: 'arrId1',
								instrument: 'instrument1',
								best: 3
							},
							{
								arrangement: 'arrId2',
								instrument: 'instrument2',
								best: 3
							}]
						}
					]);
				});
				$httpBackend.flush();
				var mod = jasmine.createSpy();
				getTuneList({
					tuneModifier: mod
				});
				expect(mod).toHaveBeenCalled();
			});

			it('shouldn\'t leak current arrangement and performance between instances of tune-list', function () {
				injectBeforeDB(function () {
					$httpBackend.whenGET('/rest/tunes').respond([
						{
							name: 'matchingArrangement',
							arrangements: [{_id: 'arrId1'}, {_id: 'arrId2'}],
							performances: [{
								arrangement: 'arrId1',
								instrument: 'instrument1',
								best: 3
							},
							{
								arrangement: 'arrId2',
								instrument: 'instrument2',
								best: 3
							}]
						}
					]);
				});
				$httpBackend.flush();
				var list1 = getTuneList({
					listName: 'list1'
				});


				var list2 = getTuneList({
					listName: 'list2'
				}, 'instrument2');

				expect($scope.list1[0].arrangement).not.toBe($scope.list2[0].arrangement);
				expect($scope.list1[0].performance).not.toBe($scope.list2[0].performance);
			});
		});

		describe('filtering, sorting and limiting', function () {
			beforeEach(function () {
				injectBeforeDB(function () {
					$httpBackend.whenGET('/rest/tunes').respond(Helpers.getValidTunes(50));
				});
				$httpBackend.flush();
			});

			it('should apply any filters passed through and publish the number of matches', function () {
				getTuneList({
					filter: function (tune) {
						return (+tune.tune.name.substr(5) % 2);
					}
				});
				expect(tuneList.tuneCount).toBe(25);
			});

			it('should apply any sorts', function () {
				getTuneList({
					sort: function (tune) {
						return -tune.tune.name.substr(5);
					}
				});
				expect(tuneList.selectedTunes[0].tune.name).toBe('valid50');
			});

			it('should apply any limits', function () {
				getTuneList({
					limit: 10
				});
				expect(tuneList.selectedTunes.length).toBe(10);
				expect(tuneList.tuneCount).toBe(50);
			});

			it('should allow not having a limit', function () {
				getTuneList({
					limit: 0
				});
				expect(tuneList.selectedTunes.length).toBe(50);
			});

			it('should combine filtering sorting and limiting well', function () {
				getTuneList({
					filter: function (tune) {
						return (+tune.tune.name.substr(5) % 2);
					},
					sort: function (tune) {
						return -tune.tune.name.substr(5);
					},
					limit: 10
				});
				expect(tuneList.selectedTunes.length).toBe(10);
				expect(tuneList.selectedTunes[0].tune.name).toBe('valid49');
			});

			it('shouldn\'t affect the central data store in any way', function () {
				getTuneList({
					filter: function (tune) {
						return (+tune.tune.name.substr(5) % 2);
					},
					sort: function (tune) {
						return -tune.tune.name.substr(5);
					},
					limit: 10
				});

				var otherTuneList = tuneListFactory({
					$scope: $scope,
					limit: 0
				});
				expect(otherTuneList.selectedTunes.length).toBe(50);
				expect(otherTuneList.selectedTunes[0].tune.name).toBe('valid1');
			});
		});
	});

	describe('Applying different config retroactively', function (){
		beforeEach(function () {
			injectBeforeDB(function () {
				$httpBackend.whenGET('/rest/tunes').respond(Helpers.getValidTunes(50));
			});
			$httpBackend.flush();
		});

		it('should apply any filters passed through and publish the number of matches', function () {
			getTuneList({
				filter: function (tune) {
					return (+tune.tune.name.substr(5) % 2);
				}
			});
			expect(tuneList.tuneCount).toBe(25);
			expect(tuneList.selectedTunes[0].tune.name).toBe('valid1');
			tuneList.relist({
				filter: function (tune) {
					return (+tune.tune.name.substr(5) + 1) % 2;
				}
			});
			expect(tuneList.tuneCount).toBe(25);
			expect(tuneList.selectedTunes[0].tune.name).toBe('valid2');
		});

		it('should apply any sorts', function () {
			getTuneList({
				sort: function (tune) {
					return -tune.tune.name.substr(5);
				}
			});
			expect(tuneList.selectedTunes[0].tune.name).toBe('valid50');
			tuneList.relist({
				sort: function (tune) {
					return tune.tune.name.substr(5);
				}
			});
			expect(tuneList.selectedTunes[0].tune.name).toBe('valid1');
		});

		it('should apply any limits', function () {
			getTuneList({
				limit: 10
			});
			expect(tuneList.selectedTunes.length).toBe(10);

			tuneList.relist({
				limit: 5
			});
			expect(tuneList.selectedTunes.length).toBe(5);

			tuneList.relist({
				limit: 25
			});
			expect(tuneList.selectedTunes.length).toBe(25);

			tuneList.relist({
				limit: 25
			});
			expect(tuneList.selectedTunes.length).toBe(25);

			tuneList.relist({
				limit: 0
			});
			expect(tuneList.selectedTunes.length).toBe(50);
		});
		it('should combine filtering sorting and limiting well', function () {
			getTuneList({
				filter: function (tune) {
					return (+tune.tune.name.substr(5) % 2);
				},
				sort: function (tune) {
					return -tune.tune.name.substr(5);
				},
				limit: 10
			});
			expect(tuneList.selectedTunes.length).toBe(10);
			expect(tuneList.selectedTunes[0].tune.name).toBe('valid49');
			tuneList.relist({
				filter: function (tune) {
					return (+tune.tune.name.substr(5) + 1) % 2;
				},
				sort: function (tune) {
					return +tune.tune.name.substr(5);
				},
				limit: 25
			});
			expect(tuneList.selectedTunes.length).toBe(25);
			expect(tuneList.selectedTunes[0].tune.name).toBe('valid2');
		});

		it('should not refresh the whole list when identical sorter/filter passed in', function () {
			var funcs = {
				filter: function (tune) {
					return true;
				},
				sort: function (tune) {
					return 1;
				}
			};
			getTuneList(funcs);
			var oldList = tuneList.selectedTunes;
			tuneList.relist(funcs);
			expect(tuneList.selectedTunes).toBe(oldList);
			funcs.limit = 25;
			tuneList.relist(funcs);
			expect(tuneList.selectedTunes).toBe(oldList);
			expect(tuneList.selectedTunes.length).toBe(25);
		});

		it('should refresh the whole list when forced to', function () {
			var funcs = {
				filter: function (tune) {
					return true;
				},
				sort: function (tune) {
					return 1;
				},
				forceRelist: true
			};
			getTuneList(funcs);
			var oldList = tuneList.selectedTunes;
			tuneList.relist(funcs);
			expect(tuneList.selectedTunes).not.toBe(oldList);
			oldList = tuneList.selectedTunes;
			funcs.limit = 25;
			tuneList.relist(funcs);
			expect(tuneList.selectedTunes).not.toBe(oldList);
			expect(tuneList.selectedTunes.length).toBe(25);
		});

		it('should refresh the whole list when forced to for no reason', function () {
			var funcs = {
				filter: function (tune) {
					return true;
				},
				sort: function (tune) {
					return 1;
				}
			};
			getTuneList(funcs);
			var oldList = tuneList.selectedTunes;
			tuneList.relist({
				forceRelist: true
			});
			expect(tuneList.selectedTunes).not.toBe(oldList);

		});
	});

	describe('moving and removing items', function () {
		beforeEach(function () {
			injectBeforeDB(function () {
				$httpBackend.whenGET('/rest/tunes').respond(Helpers.getValidTunes(50));
			});
			$httpBackend.flush();
			getTuneList();
			tune = tuneList.selectedTunes[3];
		});
		describe('moving an item to the bottom of the list', function () {
			beforeEach(function () {
				jasmine.Clock.useMock();
			});
			it('should be able to move to the bottom of a single page list', function () {
				tuneList.moveToBottom(tune);
				expect(tuneList.selectedTunes.indexOf(tune)).toBe(-1);
				expect(tuneList.otherTunes.indexOf(tune)).toBe(34);
			});

			it('should be able to move to the bottom of a two page list', function () {
				tuneList.relist({
					limit: 50
				});
				tuneList.moveToBottom(tune);
				jasmine.Clock.tick(2);
				expect(tuneList.selectedTunes.indexOf(tune)).toBe(49);
				expect(tuneList.otherTunes.indexOf(tune)).toBe(-1);
			});
		});

		describe('removing an item', function () {
			it('should be possible to remove an item', function () {
				tuneList.remove(tune);
				expect(tuneList.selectedTunes.indexOf(tune)).toBe(-1);
				expect(tuneList.otherTunes.indexOf(tune)).toBe(-1);
				expect(tuneList.selectedTunes.length).toBe(15);
			});
			it('should be possible to undo removing an item', function () {
				tuneList.remove(tune);
				expect(tuneList.selectedTunes.indexOf(tune)).toBe(-1);
				expect(tuneList.otherTunes.indexOf(tune)).toBe(-1);
				expect(tuneList.selectedTunes.length).toBe(15);
				tuneList.undoRemove();
				expect(tuneList.selectedTunes.indexOf(tune)).toBe(3);
				expect(tuneList.otherTunes.indexOf(tune)).toBe(-1);
				expect(tuneList.selectedTunes.length).toBe(15);
			});
			it('shouldn\'t cause the item to be removed from the resource or the server side data', function () {
				tuneList.remove(tune);
				var otherTuneList = tuneListFactory({
					$scope: $scope,
					limit: 0
				});
				expect(otherTuneList.selectedTunes.length).toBe(50);
				expect(otherTuneList.selectedTunes[3].tune.name).toBe('valid4');
			});
		});


	});

	describe('default tune methods', function () {
		beforeEach(function () {
			injectBeforeDB(function () {
				$httpBackend.whenGET('/rest/tunes').respond(Helpers.getValidTunes(1));
			});
			$httpBackend.flush();
			getTuneList();
			tune = tuneList.selectedTunes[0];
		});

		describe('update', function () {
			it('should call the tune\'s update method', function () {
				spyOn(tune.tune, '$update');
				$scope.update.apply({
					tune: tune
				});
				expect(tune.tune.$update).toHaveBeenCalled();
			});
		});
		describe('expand', function () {
			it('should open the tune viewer with the selected tune', function () {
				inject(function (jModals) {
					spyOn(jModals, 'open');
					$scope.expandTune.apply({
						tune: tune
					});
					expect(jModals.open).lastCalledWith('tune-viewer');
					expect($rootScope.activeTune).toBe(tune);
				});

			});
		});
	});
});

