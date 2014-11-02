describe('controllers/include/add-tune', function () {
    
    var $scope;

    beforeEach(angular.mock.module('jnr'));

    beforeEach(inject(function($injector) {
        $scope = $injector.get('$rootScope').$new();
        $injector.get('$controller')('addTune', { 
            $scope: $scope,
            $routeParams: {
                instrument: 'instrument1'
            }
        });
        $scope.$dismiss = jasmine.createSpy('close modal');

    }));

    describe('closing the modal', function () {
        it('should not close the modal when an invalid tune entered', function () {
            $scope.newTune = {
                performance: {}
            };
            $scope.save();
            expect($scope.$dismiss).not.toHaveBeenCalled();
        });
        it('should close the modal when a valid tune entered', function () {
            $scope.newTune = {
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
            $scope.save();
            expect($scope.$dismiss).toHaveBeenCalled();
        });
    });





});