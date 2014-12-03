describe('services/database', function () {

	var $httpBackend,
		database,
		$rootScope,

		respondTo = function (resourceNames) {
			resourceNames.map(function (name) {
				$httpBackend.whenGET('/rest/' + name).respond('[{"name": "' + name + '"}]');
			});
		};

	beforeEach(angular.mock.module('jnr'));

	beforeEach(inject(function($injector) {
		// Set up the mock http service responses
		$httpBackend = $injector.get('$httpBackend');
		$rootScope = $injector.get('$rootScope');
		Helpers.Server.addHttp($httpBackend);
		Helpers.Server.mockViews();
		Helpers.Server.mockScraper();
		database = $injector.get('jDatabase');

	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	describe('Fetching resources and tables', function () {
		it('should make an ajax request when a table is requested for the first time', function () {
			respondTo(['sets']);
			var sets = database.getTable('sets');
			$httpBackend.expectGET('/rest/sets');
			expect(sets.length).toBe(0);

			$httpBackend.flush();
			expect(sets.length).toBe(1);
		});

		it('should not make more than one ajax request per table', function () {
			$httpBackend.expectGET('/rest/sets').respond([{name: 'sets'}]);
			database.getTable('sets');
			$httpBackend.flush();
			database.getTable('sets');
		});

		it('should not make an ajax request when only the resource is requested', function () {
			var sets = database.getResource('sets');
			$httpBackend.verifyNoOutstandingRequest();
		});

		it('should update from thesession.org only when tunes requested', function () {
			database.getTable('sets');
			$httpBackend.expectGET('/rest/sets').respond([{name: 'sets'}]);
			$httpBackend.flush();
			$httpBackend.verifyNoOutstandingRequest();
			database.getTable('tunes');
			$httpBackend.expectGET('/rest/tunes').respond([{name: 'tunes'}]);
			$httpBackend.expectGET('/rest/scraper').respond([{name: 'scraper'}]);
			$httpBackend.flush();
			$httpBackend.verifyNoOutstandingExpectation();
		});
		xdescribe('bulk init', function () {
			beforeEach(inject(function($resource) {
				$resource.factory('$resource', function() {
					this.$get = function() {
						return jasmine.createSpy('$resource');
					};
				});
			}));

			it('should be possible to bulk initialise resources', function () {
				var $resource;

				inject(function($injector) {
					$resource = $injector.get('$resource');
				});
				// spyOn($resource);
				database.init('tunes', 'sets');
				expect($resource.calls.length).toBe(2);

				$httpBackend.verifyNoOutstandingExpectation();
			});
		});

		it('should only initialise a given resource once', function () {
			var res1 = database.getResource('sets'),
				res2 = database.getResource('sets');

			expect(res1).toBe(res2);

		});

	});

	describe('scraper', function () {
		it('should append scraped records to tunes table', function () {
			var table = database.getTable('tunes');
			$httpBackend.expectGET('/rest/tunes').respond([{name: 'tunes'}]);
			$httpBackend.expectGET('/rest/scraper').respond([{name: 'scraper'}]);
			$httpBackend.flush();
			$httpBackend.verifyNoOutstandingExpectation();
			expect(table.length).toBe(2);
		});
		it('should fire an event when data returned', function () {
			var table = database.getTable('tunes'),
				spy = jasmine.createSpy('new tune spy');

			$rootScope.$on('newTunesFetched', spy);
			$httpBackend.expectGET('/rest/tunes').respond([{name: 'tunes'}]);
			$httpBackend.expectGET('/rest/scraper').respond([{name: 'scraper'}]);
			$httpBackend.flush();
			$httpBackend.verifyNoOutstandingExpectation();
			expect(spy).toHaveBeenCalled();
		});

		it('should not fire an event when no data returned', function () {
			var table = database.getTable('tunes'),
				spy = jasmine.createSpy('new tune spy');

			$rootScope.$on('newTunesFetched', spy);
			$httpBackend.expectGET('/rest/tunes').respond([{name: 'tunes'}]);
			$httpBackend.expectGET('/rest/scraper').respond([]);
			$httpBackend.flush();
			$httpBackend.verifyNoOutstandingExpectation();
			expect(spy).not.toHaveBeenCalled();
		});
	});

	describe('resource methods', function () {
		xit('should attach a caching get method to each resource', function () {
			$httpBackend.whenGET('/rest/res').respond('[{"_id": 1}]');
			// var res = database.getResource('res');
			// res.get({id:1});
			var tab = database.getTable('res');
			$httpBackend.flush();
			tab[0].$get();
		});

		xit('should attach an update method to each resource', function () {
			$httpBackend.whenGET('/rest/res').respond('[{"_id": 1}]');
			$httpBackend.whenPUT('/rest/res/1').respond('[{"_id": 1}]');
			// var res = database.getResource('res');
			// expect(function () {
			//	 res.update({id:1});
			// }).not.toThrow();
			var tab = database.getTable('res');
			$httpBackend.flush();
			expect(function () {
				tab[0].$update();
			}).not.toThrow();
			$httpBackend.flush();

		});

	});

});