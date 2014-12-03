describe('controllers/list-tunes', function () {
	var browser,
		$scope,
		$httpBackend;

	function initController () {
		inject(function($injector) {
			var $rootScope = $injector.get('$rootScope');
			$rootScope.dropdowns = $injector.get('jDropdowns');
			$scope = $injector.get('$rootScope').$new();
			$injector.get('$controller')('listTunes', {
				$scope: $scope,
				$routeParams: {
					instrument: 'instrument1'
				}
			});
			$httpBackend.flush();
		});
	}

	beforeEach(angular.mock.module('jnr'));

	beforeEach(inject(function ($injector) {
		browser = new angular.mock.$Browser();
		browser.url('/tunes/instrument1');
		$httpBackend = $injector.get('$httpBackend');
		Helpers.Server.addHttp($httpBackend);
		Helpers.Server.mockViews();
		Helpers.Server.mockScraper();

	}));

	it('should update the page state', inject(function(jPageState) {
		spyOn(jPageState, 'set').andCallThrough();
		$httpBackend.whenGET('/rest/tunes').respond(Helpers.getValidTunes(10));
		initController();
		expect(jPageState.set).toHaveBeenCalledWith({
			section: 'tunes',
			instrument: 'instrument1',
			path: '/tunes'
		});
	}));

	describe('populating the tune list', function () {
		it ('should only include correct items', function () {
			$httpBackend.whenGET('/rest/tunes').respond([
				{
					arrangements: [{_id: 'arrId'}],
					performances: []
				},
				{
					arrangements: [{_id: 'arrId'}],
					performances: [{
						arrangement: 'arrId',
						instrument: 'instrument2'
					}]
				},
				{
					arrangements: [{_id: 'arrId'}],
					performances: [{
						arrangement: 'arrId',
						instrument: 'instrument1',
						best: 2
					}]
				},
				{
					name: 'valid',
					arrangements: [{_id: 'arrId'}],
					performances: [{
						arrangement: 'arrId',
						instrument: 'instrument1',
						best: 2,
						special: true
					}]
				},
				{
					name: 'valid',
					arrangements: [{_id: 'arrId'}],
					performances: [{
						arrangement: 'arrId',
						instrument: 'instrument1',
						best: 3
					}]
				}
			]);
			initController();

			expect($scope.tunes.length).toBe(2);
			expect($scope.tunes[0].tune.name).toBe('valid');
		});

		it('should not exceed the maximum number of items', function () {

			$httpBackend.whenGET('/rest/tunes').respond(Helpers.getValidTunes(30));
			initController();
			expect($scope.tunes.length).toBe(15);
		});
	});

	describe('practicing a tune', function () {
		it('should hide the current tune and show another', function () {
			var tunes = Helpers.getValidTunes(16);

			$httpBackend.whenGET('/rest/tunes').respond(tunes);
			initController();
			var tune = $scope.tunes[3];
			tune.dummyStandard = 3;
			tune.tune.$update = function () {};
			expect($scope.tunes[3].tune.name).toBe('valid4');
			expect($scope.tunes[14].tune.name).toBe('valid15');
			$scope.update.apply({
				tune: tune
			});
			expect($scope.tunes.length).toBe(15);
			expect($scope.tunes[3].tune.name).toBe('valid5');
			expect($scope.tunes[14].tune.name).toBe('valid16');
		});
		it('should update the practice status of the performance', function () {
			var tunes = Helpers.getValidTunes(1),
				now = (new Date()).getTime();

			$httpBackend.whenGET('/rest/tunes').respond(tunes);
			initController();
			var tune = $scope.tunes[0];
			tune.tune.$update = jasmine.createSpy();
			tune.dummyStandard = 3;
			$scope.update.apply({
				tune: tune
			});
			expect(tune.tune.$update).toHaveBeenCalled();
			expect(tune.performance.lastPracticed instanceof Date).toBeTruthy();
			expect(tune.performance.lastPracticed.getTime()).toBeGreaterThan(now);

		});
		describe('when performance doesn\'t exist', function () {
			var tune,
				database,
				performances;

			beforeEach(inject(function (jDatabase) {
				database = jDatabase;
				performances = database.getResource('performances');
			}));
			beforeEach(function () {

				var tunes = [{
					name: 'tune',
					popularity: 2,
					rating: 3,
					performances: [],
					arrangements: [{_id: 'arrId'}]
				}];

				$httpBackend.whenGET('/rest/tunes').respond(tunes);
				initController();
				$scope.searchTerm = 'tune';
				$scope.search();
				tune = $scope.tunes[0];
			});
			it('should create a performance when none exists when updating practice', function () {
				tune.dummyStandard = 2;

				spyOn(performances, 'save').andCallFake(function (data, callback) {
					data.dummy = false;
					callback(data);
				});
				spyOn(tune.tune, '$update');
				$scope.update.apply({
					tune: tune
				});

				expect(tune.tune.performances[0].instrument).toBe('instrument1');
				expect(tune.tune.performances[0].standard).toBe(2);

				tune.dummyStandard = 3;
				$scope.update.apply({
					tune: tune
				});

				expect(tune.tune.$update.calls.length).toBe(2);
				expect(tune.tune.performances[0].standard).toBe(3);

			});

		});

	});


	describe('practice order', function () {
		var sort,
			tune,
			now,
			defaultVal;

		beforeEach(function () {
			inject(function (jNow) {
				now = [jNow.getFullYear(), jNow.getMonth(), jNow.getDate()];
			});
			$httpBackend.whenGET('/rest/tunes').respond(Helpers.getValidTunes(0));
			initController();
			sort = $scope.sorters.practice;
			inject(function (jTune) {
				var perf = {
					standard: 3,
					best: 3,
					difficulty: 2,
					lastPracticed: new Date(now[0], now[1], now[2] - 5),
					special: false,
					instrument: 'instrument1',
					arrangement: 'arr1'
				};
				tune = new jTune({
						popularity: 2,
						rating: 3,
						performances: [perf],
						arrangements: [{_id: 'arr1'}]
					}, {
						performance: perf
					});
				defaultVal = sort(tune);
			});

		});

		it('should sort sensibly if no performance exists yet', function () {
			delete tune.performance;
			expect(typeof sort(tune)).toBe('number');
		});

		it('should treat undefined rating and difficulty like a zero value', function () {
			tune.tune.popularity = 0;
			tune.tune.rating = 0;
			tune.performance.difficulty = 0;
			var zeroSort = sort(tune);
			tune.tune.popularity = -1;
			expect(sort(tune)).toBe(zeroSort);
			tune.tune.rating = -1;
			expect(sort(tune)).toBe(zeroSort);
			tune.performance.difficulty = -1;
			expect(sort(tune)).toBe(zeroSort);
		});

		it('should be slightly influenced by tune popularity', function () {
			tune.tune.popularity = 4;
			expect(sort(tune)).toBeLessThan(defaultVal);
			tune.tune.popularity = 0;
			expect(sort(tune)).toBeGreaterThan(defaultVal);
			expect(sort(tune)).not.toBe(0);
		});
		it('should be heavily influenced by specialness', function () {
			tune.performance.special = true;
			expect(sort(tune)).toBeLessThan(defaultVal);
		});
		it('should be medially influenced by my rating', function () {
			tune.tune.rating = 4;
			expect(sort(tune)).toBeLessThan(defaultVal);
			tune.tune.rating = 0;
			expect(sort(tune)).toBeGreaterThan(defaultVal);
			expect(sort(tune)).not.toBe(0);
		});

		it('should be medially influenced by difficulty', function () {
			tune.performance.difficulty = 4;
			expect(sort(tune)).toBeLessThan(defaultVal);
			tune.performance.difficulty = 0;
			expect(sort(tune)).toBeGreaterThan(defaultVal);
			expect(sort(tune)).not.toBe(0);

			tune.performance.difficulty = 4;
			tune.performance.best = 2;
			tune.performance.standard = 1;
			defaultVal = sort(tune);
			tune.performance.difficulty = 3;
			expect(sort(tune)).toBeLessThan(defaultVal);
			expect(sort(tune)).not.toBe(0);
		});

		it('should be heavily influenced by gap between best and current status', function () {
			tune.performance.best = 4;
			expect(sort(tune)).toBeLessThan(defaultVal);
			tune.performance.best = 3;
			tune.performance.standard = 2;
			expect(sort(tune)).toBeLessThan(defaultVal);
		});
		it('should be very heavily influenced by dropping below 3', function () {
			tune.performance.best = 4;
			var aboveThree = sort(tune);
			tune.performance.best = 3;
			tune.performance.standard = 2;
			var belowThree = sort(tune);
			expect(belowThree).toBeLessThan(aboveThree);
		});

		it('should take into account whether other versions of the tune exist', function () {
			tune.tune.performances = new Array(2);
			expect(sort(tune)).toBeGreaterThan(defaultVal);
		});

		it('should be heavily affected by days since last practice', function () {
			tune.performance.lastPracticed = new Date(now[0], now[1], now[2] - 6);
			tune._setLastPracticedDays();
			expect(sort(tune)).toBeLessThan(defaultVal);
			tune.performance.lastPracticed = new Date(now[0], now[1], now[2] - 4);
			tune._setLastPracticedDays();
			expect(sort(tune)).toBeGreaterThan(defaultVal);
		});

		xit('should ignore timescales less than a day, and round to nearest day', function () {
			expect(false).toBeTruthy();
		});

		xit('should always put tune just practiced below all others not practiced today', function () {
			var worstCase = sort({
					popularity: 0,
					rating: 1,
					performance: {
						standard: 5,
						best: 5,
						difficulty: 1,
						lastPracticed: new Date(now[0], now[1], now[2] - 1),
						special: false
					},
					performances: new Array(2)
				}),
				bestCase = sort({
					popularity: 3,
					rating: 5,
					performance: {
						standard: 0,
						best: 5,
						difficulty: 4,
						lastPracticed: new Date(now[0], now[1], now[2]),
						special: true
					},
					performances: new Array(1)
				});


			expect(bestCase).toBeGreaterThan(worstCase);
		});

		xit('should take into account pattern of last few practices', function () {
			tune.performance.special = true;
			expect(sort(tune)).toBeLessThan(defaultVal);
		});
	});

	describe('searching and filtering', function () {
		describe('searching by name', function () {
			it('should adjust the limit on list length', function () {
				$httpBackend.whenGET('/rest/tunes').respond(Helpers.getValidTunes(25));
				initController();
				$scope.searchTerm = 'valid';
				$scope.search();
				expect($scope.tunes.length).toBe(25);
				$scope.searchTerm = '';
				$scope.search();
				expect($scope.tunes.length).toBe(15);
			});
			describe('applying the search term', function () {


				beforeEach(function () {
					$httpBackend.whenGET('/rest/tunes').respond(Helpers.getValidTunes(5, [
						{name: 'The quick brown'},
						{name: 'Fox ran over'},
						{name: 'The lazy dog'},
						{name: 'Thequickbrownfox'},
						{name: 'Ranoverthelazydog'}
					]));
					initController();
				});


				it('should ignore search strings less than 4 letters long', function () {
					$scope.search();
					expect($scope.tunes.length).toBe(5);
					$scope.searchTerm = 'hog';
					$scope.search();
					expect($scope.tunes.length).toBe(5);
					$scope.searchTerm = '5555';
					$scope.search();
					expect($scope.tunes.length).toBe(0);
				});

				it('should search by longer strings', function () {
					$scope.searchTerm = 'foxran';
					$scope.search();
					expect($scope.tunes.length).toBe(1);
					expect($scope.tunes[0].tune.name).toBe('Fox ran over');
					$scope.searchTerm = 'ranlazydog';
					$scope.search();
					expect($scope.tunes.length).toBe(1);
					expect($scope.tunes[0].tune.name).toBe('Ranoverthelazydog');
				});

				it('should be case insensitive and agnostic about spaces', function () {
					$scope.searchTerm = 'tHE Q';
					$scope.search();

					expect($scope.tunes.length).toBe(2);
					expect($scope.tunes.map(function (tune) {
						return tune.tune.name;
					}).indexOf('The quick brown')).not.toBe(-1);
					expect($scope.tunes.map(function (tune) {
						return tune.tune.name;
					}).indexOf('Thequickbrownfox')).not.toBe(-1);
				});

				it('should correctly get no matches', function () {
					$scope.searchTerm = 'qzqz';
					$scope.search();
					expect($scope.tunes.length).toBe(0);
					$scope.searchTerm = '1234';
					$scope.search();
					expect($scope.tunes.length).toBe(0);
					$scope.searchTerm = '';
					$scope.search();
					expect($scope.tunes.length).toBe(5);
				});
				it('should correctly restore unsearched list', function () {
					$scope.searchTerm = 'foxran';
					$scope.search();
					expect($scope.tunes.length).toBe(1);
					$scope.searchTerm = '';
					$scope.search();
					expect($scope.tunes.length).toBe(5);
				});
			});
		});

		describe('filtering by key', function () {
			beforeEach(function () {
				$httpBackend.whenGET('/rest/tunes').respond(Helpers.getValidTunes(9, [
					{
						arrangements: [{
							_id: 'arrId',
							root: 'A'
						}],
						rhythm: 'reel',
						mode: 'maj'
					},
					{
						arrangements: [{
							_id: 'arrId',
							root: 'A'
						}],
						rhythm: 'reel',
						mode: 'min'
					},
					{
						arrangements: [{
							_id: 'arrId',
							root: 'A'
						}],
						rhythm: 'reel',
						mode: 'mix'
					},
					{
						arrangements: [{
							_id: 'arrId',
							root: 'G'
						}],
						rhythm: 'reel',
						mode: 'maj'
					},
					{
						arrangements: [{
							_id: 'arrId',
							root: 'G'
						}],
						rhythm: 'reel',
						mode: 'min'
					},

					{
						arrangements: [{
							_id: 'arrId',
							root: 'G'
						}],
						rhythm: 'reel',
						mode: 'mix'
					},
					{
						arrangements: [{
							_id: 'arrId',
							root: 'D'
						}],
						rhythm: 'reel',
						mode: 'maj'
					},
					{
						arrangements: [{
							_id: 'arrId',
							root: 'D'
						}],
						rhythm: 'reel',
						mode: 'min'
					},

					{
						arrangements: [{
							_id: 'arrId',
							root: 'D'
						}],
						rhythm: 'reel',
						mode: 'mix'
					}
				]));
				initController();
			});




			it('should ignore invalid modes', function () {
				$scope.filterMode = 'P';
				expect(function () {
					$scope.filter();
				}).not.toThrow();
				expect($scope.tunes.length).toBe(9);
				$scope.filterMode = 'aeoP';
				expect(function () {
					$scope.filter();
				}).not.toThrow();
				expect($scope.tunes.length).toBe(9);
				$scope.filterMode = '3';
				expect(function () {
					$scope.filter();
				}).not.toThrow();
				expect($scope.tunes.length).toBe(9);
			});

			it('should handle typos that result in no mode chosen', function () {
				$scope.filterMode = 'A|';
				expect(function () {
					$scope.filter();
				}).not.toThrow();
				expect($scope.tunes.length).toBe(3);
			});

			it('should handle root only', function () {
				$scope.filterMode = 'A';
				$scope.filter();
				expect($scope.tunes.length).toBe(3);
				$scope.tunes.map(function (tune) {
					expect(tune.arrangement.root).toBe('A');
				});
			});



			it('should handle multiple roots', function () {
				$scope.filterMode = 'A|G';
				$scope.filter();
				expect($scope.tunes.length).toBe(6);
				$scope.tunes.map(function (tune) {
					expect(['A', 'G']).toContain(tune.arrangement.root);
				});
			});

			it('should handle mode only', function () {
				$scope.filterMode = 'maj';
				$scope.filter();
				expect($scope.tunes.length).toBe(3);
				$scope.tunes.map(function (tune) {
					expect(tune.tune.mode).toBe('maj');
				});
			});

			it('should handle multiple modes', function () {
				$scope.filterMode = 'maj|min';
				$scope.filter();
				expect($scope.tunes.length).toBe(6);
				$scope.tunes.map(function (tune) {
					expect(['maj', 'min']).toContain(tune.tune.mode);
				});
			});

			it('should handle combination of mode and root', function () {
				$scope.filterMode = 'Dmaj';
				$scope.filter();
				expect($scope.tunes.length).toBe(1);
				$scope.tunes.map(function (tune) {
					expect(tune.tune.mode).toBe('maj');
					expect(tune.arrangement.root).toBe('D');
				});
			});

			it('should handle combination of multiple modes and roots', function () {
				$scope.filterMode = 'Dmaj|Amin';
				$scope.filter();
				expect($scope.tunes.length).toBe(2);
				expect($scope.tunes[0].tune.mode).toBe('min');
				expect($scope.tunes[0].arrangement.root).toBe('A');
				expect($scope.tunes[1].tune.mode).toBe('maj');
				expect($scope.tunes[1].arrangement.root).toBe('D');
			});

			it('should handle combination of multiple modes and one root', function () {
				$scope.filterMode = 'Dmaj|min';
				$scope.filter();
				expect($scope.tunes.length).toBe(2);
				expect($scope.tunes[0].tune.mode).toBe('maj');
				expect($scope.tunes[0].arrangement.root).toBe('D');
				expect($scope.tunes[1].tune.mode).toBe('min');
				expect($scope.tunes[1].arrangement.root).toBe('D');
			});

			it('should handle combination of modes and key', function () {
				$scope.filterMode = 'maj|Dmin';
				$scope.filter();
				expect($scope.tunes.length).toBe(4);
				expect($scope.tunes[0].tune.mode).toBe('maj');
				expect($scope.tunes[0].arrangement.root).toBe('A');
				expect($scope.tunes[1].tune.mode).toBe('maj');
				expect($scope.tunes[1].arrangement.root).toBe('G');
				expect($scope.tunes[2].tune.mode).toBe('maj');
				expect($scope.tunes[2].arrangement.root).toBe('D');
				expect($scope.tunes[3].tune.mode).toBe('min');
				expect($scope.tunes[3].arrangement.root).toBe('D');
			});

			it('should longer combination of modes and key', function () {
				$scope.filterMode = 'maj|Dmin';
				$scope.filter();
				expect($scope.tunes.length).toBe(4);
				expect($scope.tunes[0].tune.mode).toBe('maj');
				expect($scope.tunes[0].arrangement.root).toBe('A');
				expect($scope.tunes[1].tune.mode).toBe('maj');
				expect($scope.tunes[1].arrangement.root).toBe('G');
				expect($scope.tunes[2].tune.mode).toBe('maj');
				expect($scope.tunes[2].arrangement.root).toBe('D');
				expect($scope.tunes[3].tune.mode).toBe('min');
				expect($scope.tunes[3].arrangement.root).toBe('D');
			});

			it('should handle combination of multiple roots and one mode', function () {
				$scope.filterMode = 'D|Amaj';
				$scope.filter();
				expect($scope.tunes.length).toBe(2);
				expect($scope.tunes[0].tune.mode).toBe('maj');
				expect($scope.tunes[0].arrangement.root).toBe('A');
				expect($scope.tunes[1].tune.mode).toBe('maj');
				expect($scope.tunes[1].arrangement.root).toBe('D');
			});

			it('should handle negation of a simple term', function () {
				$scope.filterMode = '!D';
				$scope.filter();
				expect($scope.tunes.length).toBe(6);
				$scope.tunes.map(function (tune) {
					expect(tune.arrangement.root).not.toBe('D');
				});
			});

			it('should handle negation of a complex term', function () {
				$scope.filterMode = '!Dmaj';
				$scope.filter();
				expect($scope.tunes.length).toBe(8);
				$scope.tunes.map(function (tune) {
					expect(tune.arrangement.root + tune.tune.mode).not.toBe('Dmaj');
				});
			});

			xit('should handle multiple complex terms', function () {
				$scope.filterMode = '!Dmaj|!Amin';
				$scope.filter();
				expect($scope.tunes.length).toBe(7);
				$scope.tunes.map(function (tune) {
					expect(tune.arrangement.root + tune.tune.mode).not.toBe('Dmaj');
					expect(tune.arrangement.root + tune.tune.mode).not.toBe('Amin');
				});
			});

		});

		describe('filtering by rhythm', function () {
			beforeEach(function () {
				$httpBackend.whenGET('/rest/tunes').respond(Helpers.getValidTunes(3, [
					{
						arrangements: [{
							_id: 'arrId',
							root: 'A'
						}],
						rhythm: 'reel',
						mode: 'maj'
					},
					{
						arrangements: [{
							_id: 'arrId',
							root: 'A'
						}],
						rhythm: 'jig',
						mode: 'min'
					},
					{
						arrangements: [{
							_id: 'arrId',
							root: 'A'
						}],
						rhythm: 'hornpipe',
						mode: 'mix'
					}
				]));
				initController();
			});

			it('should handle single rhythms', function () {
				$scope.filterRhythm = 'jig';
				$scope.filter();
				expect($scope.tunes.length).toBe(1);
				expect($scope.tunes[0].tune.rhythm).toBe('jig');
			});

			it('should handle excluding rhythms', function () {
				$scope.filterRhythm = '!jig';
				$scope.filter();
				expect($scope.tunes.length).toBe(2);
				expect($scope.tunes[0].tune.rhythm).toBe('reel');
				expect($scope.tunes[1].tune.rhythm).toBe('hornpipe');
			});

			it('should handle multiple rhythms', function () {
				$scope.filterRhythm = 'jig|reel';
				$scope.filter();
				expect($scope.tunes.length).toBe(2);
				expect($scope.tunes[0].tune.rhythm).toBe('reel');
				expect($scope.tunes[1].tune.rhythm).toBe('jig');
			});


		});

		describe('combining filter and search', function () {
			it('should clear search term when filter called', function () {
				$scope.searchTerm = 'test';
				$scope.filter();
				expect($scope.searchTerm).toBeFalsy();
			});

			it('should clear filter terms when search called', function () {
				$scope.filterRhythm = 'test';
				$scope.filterMode = 'test';
				$scope.search();
				expect($scope.filterRhythm).toBe('test');
				expect($scope.filterMode).toBe('test');
				$scope.searchTerm = 'search';
				$scope.search();
				expect($scope.filterRhythm).toBeFalsy();
				expect($scope.filterMode).toBeFalsy();


			});

			it('should combine key and rhythm filters well', function () {
				$httpBackend.whenGET('/rest/tunes').respond(Helpers.getValidTunes(4, [
					{
						arrangements: [{
							_id: 'arrId',
							root: 'A'
						}],
						rhythm: 'reel',
						mode: 'maj'
					},
					{
						arrangements: [{
							_id: 'arrId',
							root: 'A'
						}],
						rhythm: 'jig',
						mode: 'min'
					},
					{
						arrangements: [{
							_id: 'arrId',
							root: 'A'
						}],
						rhythm: 'reel',
						mode: 'mix'
					},
					{
						arrangements: [{
							_id: 'arrId',
							root: 'G'
						}],
						rhythm: 'jig',
						mode: 'maj'
					}
				]));
				initController();
				$scope.filterRhythm = 'jig';
				$scope.filterMode = 'A';
				$scope.filter();
				expect($scope.tunes.length).toBe(1);
				expect($scope.tunes[0].tune.rhythm).toBe('jig');
				expect($scope.tunes[0].arrangement.root).toBe('A');
			});

			it('should ignore blank strings', function () {
				$httpBackend.whenGET('/rest/tunes').respond(Helpers.getValidTunes(4, [
					{
						arrangements: [{
							_id: 'arrId',
							root: 'A'
						}],
						rhythm: 'reel',
						mode: 'maj'
					},
					{
						arrangements: [{
							_id: 'arrId',
							root: 'A'
						}],
						rhythm: 'jig',
						mode: 'min'
					},
					{
						arrangements: [{
							_id: 'arrId',
							root: 'A'
						}],
						rhythm: 'reel',
						mode: 'mix'
					},
					{
						arrangements: [{
							_id: 'arrId',
							root: 'G'
						}],
						rhythm: 'jig',
						mode: 'maj'
					}
				]));
				initController();
				$scope.filterRhythm = 'jig';
				$scope.filterMode = 'G';
				$scope.filter();
				$scope.filterRhythm = ' ';
				$scope.filterMode = ' ';
				$scope.filter();
				expect($scope.tunes.length).toBe(4);
			});
		});
	});
});
