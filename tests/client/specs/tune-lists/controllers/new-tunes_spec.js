describe('controllers/include/new-tunes', function () {

	var $scope,
		$rootScope,
		database,
		$httpBackend;

	function initController (noFlush) {
		inject(function($injector) {
			$rootScope = $injector.get('$rootScope');
			$scope = $rootScope.$new();
			$injector.get('$controller')('newTunes', {
				$scope: $scope,
				$routeParams: {
					instrument: 'instrument1'
				}
			});
			if(!noFlush) {
				$httpBackend.flush();
			}
		});
	}

	function getNewTunes (n) {
		return  Helpers.getValidTunes(n, {
			rating: -1
		});
	}

	beforeEach(angular.mock.module('jnr'));

	beforeEach(inject(function ($injector) {
		$httpBackend = $injector.get('$httpBackend');
		Helpers.Server.addHttp($httpBackend);
		Helpers.Server.mockViews();
		Helpers.Server.mockScraper();
	}));


	describe('populating the tune list', function () {
		it ('should only include tunes with either rating or rating undefined, regardless of performances', function () {
			$httpBackend.whenGET('/rest/tunes').respond([
				{
					name: 'valid1',
					arrangements: [{_id: 'arrId'}],
					performances: [],
					rating: -1
				},
				{
					name: 'invalid',
					arrangements: [{_id: 'arrId'}],
					performances: [],
					rating: 1
				},
				{
					name: 'valid2',
					arrangements: [{_id: 'arrId'}],
					performances: [{
						arrangement: 'arrId',
						instrument: 'instrument2'
					}],
					rating: -1
				}
			]);
			initController();
			expect($scope.newTunes.length).toBe(2);
			expect($scope.newTunes[0].tune.name).toBe('valid1');
			expect($scope.newTunes[1].tune.name).toBe('valid2');
			expect($rootScope.newTuneCount).toBe(2);
		});

		it('should not exceed the maximum number of items', function () {

			$httpBackend.whenGET('/rest/tunes').respond(getNewTunes(30));
			initController();
			expect($scope.newTunes.length).toBe(4);
		});



		it('should relist when scraper returns with new tunes', function () {
			$httpBackend.whenGET('/rest/tunes').respond([
				{
					name: 'valid1',
					arrangements: [{_id: 'arrId'}],
					performances: [{
						instrument: 'mandolin',
						arrangement: 'arrId',
						difficulty: 1
					}],
					rating: -1
				}
			]);
			initController();
			var relistSpy = jasmine.createSpy('relist');
			$scope.$on('tunesListed', relistSpy);
			$rootScope.$broadcast('newTunesFetched');
			expect(relistSpy).toHaveBeenCalled();

		});
	});

	describe('updating a tune', function () {

		it('should update the properties of the tune but not hide it', function () {

			$httpBackend.whenGET('/rest/tunes').respond(getNewTunes(1));
			initController();
			var tune = $scope.newTunes[0];
			tune.tune.$update = jasmine.createSpy('tune.$update');
			$scope.update.call({
				tune: tune
			});
			expect(tune.tune.$update).toHaveBeenCalled();
			tune.tune.$update.calls = [];
			tune.tune.rating = 1;
			$scope.update.call({
				tune: tune
			});
			expect(tune.tune.$update).toHaveBeenCalled();
		});
		describe('new tune count', function () {
			it('should update the newTuneCount only for change in rating', function () {

				$httpBackend.whenGET('/rest/tunes').respond(getNewTunes(1));
				initController();
				var tune = $scope.newTunes[0];
				tune.tune.$update = jasmine.createSpy('tune.$update');

				tune.tune.popularity = 1;
				$scope.update.call({
					tune: tune
				});
				expect(tune.tune.$update).toHaveBeenCalled();
				expect($rootScope.newTuneCount).toBe(1);
				tune.tune.rating = 1;
				$scope.update.call({
					tune: tune
				}, {
					rating: -1
				});
				expect(tune.tune.$update).toHaveBeenCalled();
				expect($rootScope.newTuneCount).toBe(0);
			});

			it('should update the newTuneCount only once per tune', function () {

				$httpBackend.whenGET('/rest/tunes').respond(getNewTunes(1));
				initController();
				var tune = $scope.newTunes[0];
				tune.tune.$update = jasmine.createSpy('tune.$update');
				tune.tune.rating = 1;
				$scope.update.call({
					tune: tune
				}, {
					rating: -1
				});
				tune.tune.rating = 2;
				$scope.update.call({
					tune: tune
				}, {
					rating: 1
				});
				expect($rootScope.newTuneCount).toBe(0);
			});
		});


		it('should hide the current tune and show another when user indicates, but not mark it as actually processed', function () {
			$httpBackend.whenGET('/rest/tunes').respond(getNewTunes(5));
			initController();
			expect($scope.newTunes[2].tune.name).toBe('valid3');
			expect($scope.newTunes[3].tune.name).toBe('valid4');
			$scope.finished.apply({
				tune: $scope.newTunes[2]
			});
			expect($scope.newTunes.length).toBe(4);
			expect($scope.newTunes[2].tune.name).toBe('valid4');
			expect($scope.newTunes[3].tune.name).toBe('valid5');
			$scope.finished.apply({
				tune: $scope.newTunes[1]
			});
			expect($scope.newTunes.length).toBe(3);
			expect($scope.newTunes[2].tune.name).toBe('valid5');

			initController(true);

			expect($scope.newTunes[2].tune.name).toBe('valid3');
		});

		it('should be possible to reinstate a tune accidentally removed', function () {
			$httpBackend.whenGET('/rest/tunes').respond(getNewTunes(1));
			initController();
			var tune = $scope.newTunes[0];
			$scope.finished.apply({
				tune: tune
			});
			expect($scope.newTunes.length).toBe(0);
			expect($scope.lastRemoved).toBeTruthy();
			$scope.undo.apply({
				tune: tune
			});
			expect($scope.newTunes.length).toBe(1);
			expect($scope.newTunes[0]).toBe(tune);
		});

		describe('updates which require a performance to be present', function () {
			var performances,
				modals;

			beforeEach(inject(function (jDatabase, jModals) {
				database = jDatabase;
				modals = jModals;
				performances = database.getResource('performances');
				spyOn(modals, 'open');
			}));

			describe('opening and closing the modal', function () {
				it('should open a modal', function () {
					$httpBackend.whenGET('/rest/tunes').respond([
						{
							name: 'valid1',
							arrangements: [{_id: 'arrId'}],
							performances: [{
								instrument: 'mandolin',
								arrangement: 'arrId',
								difficulty: 1
							}],
							rating: -1
						}
					]);

					initController();
					var scope = {
						tune: $scope.newTunes[0]
					};
					$scope.editPerformanceForInstrument.call(scope, 'instrument5');
					expect(scope.instrument).toBe('instrument5');
					expect(modals.open).lastCalledWith('performanceEditor', scope);
				});

				xit('should close the modal', function () {
					var $timeout;

					inject(function($injector) {
						$timeout = $injector.get('$timeout');
					});
					$httpBackend.whenGET('/rest/tunes').respond([
						{
							name: 'valid1',
							arrangements: [{_id: 'arrId'}],
							performances: [{
								instrument: 'mandolin',
								arrangement: 'arrId',
								difficulty: 1
							}],
							rating: -1
						}
					]);

					initController();
					var tune = $scope.newTunes[0];
					var scope = {
						tune: tune
					};
					modals.open.andCallThrough();
					$scope.editPerformanceForInstrument.call(scope, 'instrument5');
					$timeout.flush();
					tune.performance = {prop: 'wrong'};
					$scope.finishPerformanceEdit(tune);
					expect(tune.performance).toEqual({dummy: true});

				});
			});

			it('should use real performances when already defined', function () {
				$httpBackend.whenGET('/rest/tunes').respond([
					{
						name: 'valid1',
						arrangements: [{_id: 'arrId'}],
						performances: [{
							instrument: 'mandolin',
							arrangement: 'arrId',
							difficulty: 1
						}],
						rating: -1
					}
				]);
				initController();
				$scope.editPerformanceForInstrument.call({
					tune: $scope.newTunes[0]
				}, 'mandolin');
				expect($scope.newTunes[0].performance.instrument).toBe('mandolin');
				expect($scope.newTunes[0].performance.difficulty).toBe(1);

			});

			it('should create a performance when none defined', function () {
				$httpBackend.whenGET('/rest/tunes').respond(Helpers.getValidTunes(1, {
					performances: [],
					rating: -1
				}));
				initController();
				var tune = $scope.newTunes[0];
				$scope.editPerformanceForInstrument.call({
					tune: tune
				}, 'mandolin');

				expect(tune.performance.instrument).toBe('mandolin');
				spyOn(tune, 'update').andCallThrough();
				spyOn(tune, '_sync');

				tune.performance.difficulty = 1;
				$scope.update.call({
					tune: tune
				});

				expect(tune.tune.performances.length).toBe(1);
				expect(tune.tune.performances[0].instrument).toBe('mandolin');

				$scope.editPerformanceForInstrument.call({
					tune: tune
				}, 'whistle');

				expect(tune.performance.instrument).toBe('whistle');

				tune.performance.difficulty = 2;
				$scope.update.call({
					tune: tune
				});

				expect(tune.tune.performances.length).toBe(2);
				expect(tune.tune.performances[1].instrument).toBe('whistle');
			});

			it('should use the newly created performance if other properties are changed', function () {
				$httpBackend.whenGET('/rest/tunes').respond(Helpers.getValidTunes(1, {
					performances: [],
					rating: -1
				}));
				initController();

				var tune = $scope.newTunes[0];
				$scope.editPerformanceForInstrument.call({
					tune: tune
				}, 'mandolin');

				tune.performance.difficulty = 4;

				spyOn(tune, 'update').andCallThrough();
				spyOn(tune, '_sync');
				$scope.update.call({
					tune: tune
				}, 'mandolin');

				expect(tune.tune.performances.length).toBe(1);
				expect(tune.tune.performances[0].difficulty).toBe(4);
				tune.performance.standard = 3;

				var now = new Date();
				$scope.update.call({
					tune: tune
				}, 'mandolin');

				expect(tune.tune.performances.length).toBe(1);


				expect(tune.tune.performances[0].lastPracticed).toBeSameTimeAs(now);
				expect(tune.tune.performances[0].difficulty).toBe(4);
				expect(tune.tune.performances[0].best).toBe(3);

			});

			it ('should use an existing performance if it exists', function () {
				$httpBackend.whenGET('/rest/tunes').respond(Helpers.getValidTunes(1, {
					performances: [{
						instrument: 'mandolin'
					}],
					rating: -1
				}));
				initController();
				var tune = $scope.newTunes[0];

				spyOn(tune, 'update').andCallThrough();
				spyOn(tune, '_sync');

				$scope.editPerformanceForInstrument.call({
					tune: tune
				}, 'mandolin');


				spyOn(tune.tune, '$update');

				tune.performance.difficulty = 3;
				var now = new Date();
				$scope.update.call({
					tune: tune
				}, 'mandolin');

				expect(tune.tune.performances.length).toBe(1);

				expect(tune.tune.performances[0].difficulty).toBe(3);
			});
		});
	});

	describe('hiding and showing', function () {
		it('should hide the list when no tunes left', function () {
			$httpBackend.whenGET('/rest/tunes').respond(Helpers.getValidTunes(1, {
				rating: -1
			}));
			initController();
			var tune = $scope.newTunes[0];
			$rootScope.showNewTunes = true;
			tune.tune.rating = 1;
			$scope.update.call({
				tune: tune
			}, null, {
				rating: -1
			});
			expect($rootScope.showNewTunes).toBeTruthy();

			$scope.finished.call({
				tune: tune
			});
			expect($scope.newTunes.length).toBe(0);
			expect($rootScope.showNewTunes).toBeFalsy();
		});
	});
});