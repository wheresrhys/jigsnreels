describe('directives/performance-rater', function () {

    beforeEach(angular.mock.module('jnr'));

    beforeEach(inject(function ($templateCache) {
        $templateCache.put('/src/tune/tpl/performance-rater.html', '<div></div>');
    }));

    it('should add a performance rater class', inject(function ($compile, $rootScope) {
        var el = $compile('<div j-performance-rater></div>')($rootScope);
        $rootScope.$digest();
        expect(el.hasClass('performance-rater')).toBe(true);
    }));

    describe('passing in the tune', function () {
        it('should accept a tune object', inject(function ($compile, $rootScope) {
            var el = $compile('<div j-performance-rater data-ratee=\'{"test": "yes"}\'></div>')($rootScope);
            $rootScope.$digest();
            expect($rootScope.$$childHead.ratee.test).toEqual('yes');
        }));
        it('should accept the name of a property where a tune object is stored', inject(function ($compile, $rootScope) {
            $rootScope.testTune = {
                test: 'yes also'
            };
            var el = Helpers.applyDirective($compile, $rootScope, '<div j-performance-rater data-ratee="testTune"></div>');
            $rootScope.$digest();
            expect($rootScope.$$childHead.ratee.test).toEqual('yes also');
        }));
        it('should fallback to $scope.tune', inject(function ($compile, $rootScope) {
            $rootScope.tune = {
                test: 'yes again'
            };
            var el = Helpers.applyDirective($compile, $rootScope, '<div j-performance-rater></div>');
            $rootScope.$digest();
            expect($rootScope.$$childHead.ratee.test).toEqual('yes again');
        }));

    });
	
    describe('interactions', function () {
        it('should attach the new rating to the tune', inject(function ($compile, $rootScope) {
            $rootScope.testUpdate = jasmine.createSpy();
            $rootScope.tune = {
                update: jasmine.createSpy()
            };

            var el = $compile('<div j-performance-rater data-callback=></div>')($rootScope);
            $rootScope.$digest();
            $rootScope.$$childHead.updatePerformance(2);
            expect($rootScope.$$childHead.tune.dummyStandard).toBe(2);
        }));

        it('should call any specified callback', inject(function ($compile, $rootScope) {
            $rootScope.testUpdate = jasmine.createSpy();
            $rootScope.tune = {
                update: jasmine.createSpy()
            };
            var el = $compile('<div j-performance-rater data-callback="testUpdate"></div>')($rootScope);
            $rootScope.$digest();
            $rootScope.$$childHead.updatePerformance(2);
            expect($rootScope.testUpdate).toHaveBeenCalled();
        }));

        it('should defulat to calling tune.update()', inject(function ($compile, $rootScope) {
            $rootScope.testUpdate = jasmine.createSpy();
            $rootScope.tune = {
                update: jasmine.createSpy()
            };
            var el = $compile('<div j-performance-rater></div>')($rootScope);
            $rootScope.$digest();
            $rootScope.$$childHead.updatePerformance(2);
            expect($rootScope.tune.update).toHaveBeenCalled();
        }));
    });
});