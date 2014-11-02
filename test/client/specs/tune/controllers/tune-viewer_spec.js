describe('controllers/include/tune-viewer', function () {
    
    var $scope,
        $rootScope,
        database,
        $httpBackend,
        Tune,
        tune,
        $modal;

    function initController () {
        inject(function($injector) {
            var performances = [{
                    arrangement: 'arr1',
                    instrument: 'instrument1'
                }],
                arrangements = [{
                    _id: 'arr1',
                    abc: 'abc1',
                    root: 'A'
                },{
                    _id: 'arr2',
                    abc: 'abc2',
                    root: 'A'
                }];

            $modal = $injector.get('$modal');
            $rootScope = $injector.get('$rootScope');

            Tune = $injector.get('jTune');
            $rootScope.pageState = {
                instrument: 'instrument1'
            };            
            $rootScope.activeTune = tune = new Tune({                
                $update: jasmine.createSpy('tune update').andCallFake(function (callback) {
                    callback && callback($scope.tune);
                }),
                performances: performances,
                arrangements: arrangements
            }, {
                performance: performances[0]
            });

            spyOn(tune, 'update').andCallThrough();
            spyOn(tune, '_sync').andCallFake(function (callback) {
                callback && callback(tune.tune);
            });
            $scope = $rootScope.$new();
            $injector.get('$controller')('tuneViewer', { 
                $scope: $scope,
                $routeParams: {
                    instrument: 'instrument1'
                }
            });
            $scope.$dismiss = jasmine.createSpy('close modal');
            
            

        });
    }

    beforeEach(angular.mock.module('jnr'));


    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        Helpers.Server.addHttp($httpBackend);
        Helpers.Server.mockViews();
        Helpers.Server.mockScraper();
    }));

    beforeEach(function () {
        initController();
    });


    it('should use the activeTune from the root scope', function () {
        expect($scope.tune).toBe($rootScope.activeTune);
    });

    it('shoudl save changes to properties', function () {
        $scope.update();
        expect(tune.update.mostRecentCall.args[0].setPublicPerformance).toBeTruthy();
        expect(tune.performance).toBeTruthy();
    });

    it('shoudl hide after practice', function () {
        $scope.tune.dummyStandard = 3;
        $scope.update();
        expect($scope.$dismiss).toHaveBeenCalled();
    });

    describe('arrangement editing', function () {
        var dismissSpy;
        beforeEach(function () {
            dismissSpy = jasmine.createSpy('dismiss arrangement confirm');
            spyOn($modal, 'open').andCallFake(function () {
                return {
                    dismiss: dismissSpy
                };
            });
        });
        it('should not allow properties to be changed without confirmation', function () {
            $scope.updateArrangement();
            expect($modal.open).toHaveBeenCalled();
            expect(tune.update).not.toHaveBeenCalled();
        });

        it('should revert to old properties after cancellation', function () {
            $scope.tune.arrangement.root = 'E';
            $scope.updateArrangement({
                root: 'A'
            });
            $scope.cancelArrangementEdit();
            expect(dismissSpy).toHaveBeenCalled();
            expect($scope.tune.arrangement.root).toBe('A');
            
        });

        it('should edit the arrangement directly when overwrite selected', function () {
            $scope.tune.arrangement.root = 'E';
            $scope.updateArrangement({
                root: 'A'
            });
            $scope.alterArrangement();
            expect(dismissSpy).toHaveBeenCalled();
            expect($scope.tune.arrangement.root).toBe('E');
            expect($scope.tune.tune.arrangements.length).toBe(2);
        });

        it('should create and use new arrangement when create new chosen', function () {
            $scope.tune.arrangement.root = 'E';
            $scope.updateArrangement({
                root: 'A'
            });
            $scope.saveNewArrangement();
            expect(dismissSpy).toHaveBeenCalled();
            
            expect($scope.tune.tune.arrangements.length).toBe(3);
            expect($scope.tune.arrangement.root).toBe('E');
            expect($scope.tune.tune.arrangements[1].root).toBe('A');
        });

    });

    describe('abc editing', function () {
        var dismissSpy;
        beforeEach(function () {
            dismissSpy = jasmine.createSpy('dismiss arrangement confirm');
            spyOn($modal, 'open').andCallFake(function () {
                return {
                    dismiss: dismissSpy
                };
            });
        });

        it('should be possible to switch to and from abc edit mode', function () {
            $scope.editAbc();
            expect($scope.editingAbc).toBeTruthy();
            expect($scope.isNewAbc).toBeFalsy();
            $scope.cancelAbcEdit();
            expect($scope.editingAbc).toBeFalsy();
        });

        xit('should live update the display with changes to abc', function () {
            $scope.editAbc();
            expect($scope.editingAbc).toBeTruthy();
            $scope.cancelAbcEdit();
            expect($scope.editingAbc).toBeFalsy();
        });

        it('should not affect the current arrangement of the tune when cancelled', function () {
            $scope.editAbc();
            expect($scope.editableScoreGenerator).not.toBe($scope.tune.scoreGenerator);
            $scope.editableScoreGenerator.arrangement.abc = 'def';
            $scope.cancelAbcEdit();
            expect($scope.tune.arrangement.abc).not.toBe('def');
            expect($scope.tune.scoreGenerator.arrangement.abc).not.toBe('def');
        });

        it('should not affect the current arrangement of the tune before confirmation', function () {
            $scope.editAbc();
            expect($scope.editableScoreGenerator).not.toBe($scope.tune.scoreGenerator);
            $scope.editableScoreGenerator.arrangement.abc = 'def';
            $scope.saveAbcDialog();
            expect($modal.open).toHaveBeenCalled();
            expect($scope.tune.arrangement.abc).not.toBe('def');
            expect($scope.tune.scoreGenerator.arrangement.abc).not.toBe('def');
        });


        it('should be possible to save as a new Arrangement', function () {
            var arrangementsLength = $scope.tune.tune.arrangements.length,
                oldRoot = $scope.tune.arrangement.root;

            $scope.editAbc();
            $scope.editableScoreGenerator.arrangement.abc = 'def';
            $scope.saveAbcDialog();
            $scope.saveNewAbc();
            expect(dismissSpy).toHaveBeenCalled();
            expect($scope.tune.tune.arrangements.length).toBe(arrangementsLength + 1);
            expect($scope.tune.arrangement).toBe($scope.tune.tune.arrangements[arrangementsLength]);
            expect($scope.tune.scoreGenerator.arrangement.abc).toBe('def');
            expect($scope.tune.arrangement.abc).toBe('def');
            expect($scope.tune.arrangement.root).toBe(oldRoot);
        });

        it('should be possible to overwrite the existing arrangement', function () {
            var arrangementsLength = $scope.tune.tune.arrangements.length,
                oldArrangement = $scope.tune.arrangement;

            $scope.editAbc();
            $scope.editableScoreGenerator.arrangement.abc = 'def';
            $scope.saveAbcDialog();
            $scope.saveThisAbc();
            expect(dismissSpy).toHaveBeenCalled();
            expect($scope.tune.tune.arrangements.length).toBe(arrangementsLength);
            expect($scope.tune.scoreGenerator.arrangement).toBe(oldArrangement);
            expect($scope.tune.arrangement).toBe(oldArrangement);
            expect($scope.tune.arrangement.abc).toBe('def');
        });

    });

    describe('abc adding', function () {
        beforeEach(function () {
            spyOn($modal, 'open');
        });

        it('should be possible to switch to and from new abc mode', function () {
            $scope.newAbc();
            expect($scope.editingAbc).toBeTruthy();
            expect($scope.isNewAbc).toBeTruthy();
            expect($scope.editableScoreGenerator.arrangement.abc).toBe('');
            $scope.cancelAbcEdit();
            expect($scope.editingAbc).toBeFalsy();
        });

        it('should not affect the current arrangement of the tune when cancelled', function () {
            $scope.newAbc();
            expect($scope.tune.arrangement.abc).not.toBe('');
            expect($scope.tune.scoreGenerator.arrangement.abc).not.toBe('');
            $scope.cancelAbcEdit();
        });

        it('should not trigger confirmation dialog on saving', function () {
            $scope.newAbc();
            $scope.saveAbcDialog();
            expect($modal.open).not.toHaveBeenCalled();
            expect($scope.tune.arrangement.abc).not.toBe('def');
            expect($scope.tune.scoreGenerator.arrangement.abc).not.toBe('def');
        });


        it('should be possible to save as a new Arrangement', function () {
            var arrangementsLength = $scope.tune.tune.arrangements.length,
                oldRoot = $scope.tune.arrangement.root;

            $scope.newAbc();
            $scope.editableScoreGenerator.arrangement.abc = 'def';
            $scope.saveAbcDialog();
            expect($scope.tune.tune.arrangements.length).toBe(arrangementsLength + 1);
            expect($scope.tune.arrangement).toBe($scope.tune.tune.arrangements[arrangementsLength]);
            expect($scope.tune.arrangement.abc).toBe('def');
            expect($scope.tune.scoreGenerator.arrangement.abc).toBe('def');
            expect($scope.tune.arrangement.root).toBe(oldRoot);
        });

    });

    describe('arrangement picking', function () {

        it('should be possible to view an alternative arrangement', function () {
            expect($scope.tune.arrangement).toBe($scope.tune.tune.arrangements[0]);
            expect($scope.abcSavePending).toBeFalsy();
            $scope.nextAbc();
            expect($scope.tune.arrangement).toBe($scope.tune.tune.arrangements[1]);
            expect($scope.tune.tune.performances[0].arrangement).toBe('arr1');
            expect($scope.abcSavePending).toBeTruthy();
            
        });

        it('should be possible to save an alternative arrangement to the same performance', function () {
            $scope.nextAbc();

            $scope.saveAbcToPerformance();
            expect($scope.tune.arrangement).toBe($scope.tune.tune.arrangements[1]);
            expect($scope.tune.tune.performances[0].arrangement).toBe('arr2');
            expect($scope.abcSavePending).toBeFalsy();
            expect(tune.update).toHaveBeenCalled();
        });

        it('should be possible to save an alternative arrangement to a new performance', function () {
            $scope.nextAbc();

            $scope.saveAbcToPerformance(true);
            expect($scope.tune.arrangement).toBe($scope.tune.tune.arrangements[1]);
            expect($scope.tune.tune.performances.length).toBe(2);
            expect($scope.tune.tune.performances[0].arrangement).toBe('arr1');
            expect($scope.tune.tune.performances[1].arrangement).toBe('arr2');
            expect($scope.abcSavePending).toBeFalsy();
            expect(tune.update).toHaveBeenCalled();
        });

        it('should be possible to revert the change in arrangement', function () {
            $scope.nextAbc();

            $scope.revertAbc();
            expect($scope.tune.arrangement).toBe($scope.tune.tune.arrangements[0]);
            expect($scope.tune.performance.arrangement).toBe($scope.tune.tune.arrangements[0]._id);
            expect($scope.abcSavePending).toBeFalsy();
            expect(tune.update).not.toHaveBeenCalled();
        });

        it('should be able to cycle back to original abc', function () {
            $scope.nextAbc();
            $scope.nextAbc();

            expect($scope.tune.arrangement).toBe($scope.tune.tune.arrangements[0]);
            expect($scope.tune.tune.performances[0].arrangement).toBe('arr1');
            expect($scope.abcSavePending).toBeFalsy();
        });


    });
        

});