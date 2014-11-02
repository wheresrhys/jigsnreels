describe('directives/tune-heading', function () {
    var heading,
        el,
        $scope;

    beforeEach(angular.mock.module('jnr'));

    beforeEach(inject(function ($injector) {
        heading = $injector.get('jTuneHeadingDirective')[0].compile();
        $scope = $injector.get('$rootScope').$new();
        el = angular.element(document.createElement('div'));
        //expect(capitalise('rabbit rabbit')).toBe('Rabbit rabbit');
    }));
    describe('printing out details', function () {
        var tune1 = {
                tune: {
                    name: 'tune1',
                    rating: 1,
                    popularity: 1,
                    mode: 'aeo',
                    rhythm: 'jig'
                },
                arrangement: {
                    root: 'A'
                }
            },
            tune = {
                tune: {
                    name: 'tune',
                    rating: 2,
                    popularity: 2,
                    mode: 'mix',
                    rhythm: 'reel'
                },
                arrangement: {
                    root: 'B'
                }
            };

        beforeEach(function () {
            $scope.tune1 = tune1;
            $scope.tune = tune;
        });
        it('should use details from the correct tune', function () {
            heading($scope, el, {
                tune: 'tune1'
            });
            expect($scope.tune).toBe(tune1.tune);
            expect($scope.arrangement).toBe(tune1.arrangement);
            expect(el.hasClass('tune-heading')).toBeTruthy();
        });
        it('should use extra stats when requested', function () {
            heading($scope, el, {
                tune: 'tune1',
                stats: true
            });
            expect($scope.stats).toBeTruthy();
        });
        it('should use default tune', function () {
            heading($scope, el, {});
            expect($scope.tune).toBe(tune.tune);
        });
    });
    
    xdescribe('handling missing details', function () {

        it('should cope with missing rating', function () {
            $scope.tune = {
                tune: {
                    name: 'tune',
                    mode: 'aeo',
                    popularity: 1,
                    rating: -1,
                    rhythm: 'jig'
                },
                arrangement: {
                    root: 'A'
                }
            };
            heading($scope, el, {
                stats: true
            });
            expect($scope.statsMessage).toBe('A rare tune');
        });

        it('should cope with missing popularity', function () {
            $scope.tune = {
                tune: {
                    name: 'tune',
                    mode: 'aeo',
                    rating: 1,
                    popularity: -1,
                    rhythm: 'jig'
                },
                arrangement: {
                    root: 'A'
                }
            };
            heading($scope, el, {
                stats: true
            });
            expect($scope.statsMessage).toBe('A mediocre tune');
        });

        it('should cope with missing rating and popularity', function () {
            $scope.tune = {
                tune: {
                    name: 'tune',
                    mode: 'aeo',
                    rhythm: 'jig',
                    rating: -1,
                    popularity: -1,
                },
                arrangement: {
                    root: 'A'
                }
            };
            heading($scope, el, {
                stats: true
            });
            expect($scope.statsMessage).toBe('');
        });
        
    });
    
});