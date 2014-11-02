'use strict';

require('src/set/services/set-model');
require('src/common/services/page-state');

var _ = require('lodash');

module.exports = function (
    $routeParams, 
    $scope, 
    $rootScope,
    jModals,
    jSet,
    $timeout,
    jPageState,
    jDatabase
) {

    // console.log(jDatabase.getTable('tunes'), 'red');
    jPageState.set({
        section: 'sets',
        instrument: $routeParams.instrument,
        subsection: 'list', 
        path: '/sets/list'
    });
    
    $scope.selectedTunes = [];

    $scope.arrangements = [];
    jDatabase.getTable('tunes').$promise.then(function (data){
        $scope.arrangements = _.sortBy(data.map(function (tune) {
            var perf = _.findWhere(tune.performances, {instrument: $routeParams.instrument});
            if (perf) {
                var arr = _.findWhere(tune.arrangements, {_id: perf.arrangement});
                arr.name = tune.name + ' ' + arr.root + tune.mode + ' ' + tune.rhythm;
                arr.sanitisedName = arr.name.replace(/^(The|A) /, '');
                return arr;
            }
        }).filter(function (item) {
            return item;
        }), 'sanitisedName');  
    });

    $scope.sets = [];
    jDatabase.getTable('tunes').$promise.then(function () {
        jDatabase.getTable('sets').$promise.then(function (data) {
            $scope.sets = data.map(function (set) {
                return new jSet(set);
            });

            $timeout(function () {
                $scope.sets = _.sortBy($scope.sets, function (set) {
                    return set.performance.lastPracticed - (set.performance.standard * 12 * 60 *24000);
                });
            });
        });

    
        // $scope.sets = $scope.sets.sort(function (set1, set2) {
        //     return set2.performance.lastPracticed - set1.performance.lastPracticed;
        // });
        
    });
        

    $scope.undo = function () {
        $scope.selectedTunes.pop();
    };

    $scope.selectTune = function () {
        $scope.selectedTunes.push(this.selectedTune);
        this.selectedTune = null;
    };

    $scope.selectedIndex = -1;

    $scope.expandRow = function ($index) {
        $scope.selectedIndex = $index;
    };


    $scope.saveSet = function () {
        var tunes = $scope.selectedTunes;
        if (tunes.length) {
            jDatabase.getResource('sets').save({
                name: 'fuzzy' + Math.random(),
                tunes: tunes
            }, function (set) {
                jDatabase.getTable('sets').shift(set);
            });
            $scope.selectedTunes = [];
        }
    };

    $scope.practice = function () {
        this.tune.update();
        var set = this.$parent.$parent.set;
        var tunesLeftToPractice = set.tunes.filter(function (tune) {
            return (new Date()) - (new Date(tune.performance.lastPracticed)) > 120000;
        }).length;

        if (!tunesLeftToPractice) {
            $scope.sets.splice($scope.sets.indexOf(set), 1);
            $scope.sets.push(set);
        }

    };

    $scope.expandTune = function (opts) {
        opts = opts || {};
        $rootScope.activeTune = this.tune;
        this.propertiesCollapsed = !opts.edit;
        this.showPerformance = !opts.noPerformance;
        jModals.open('tuneViewer', this);
    };

    $scope.practiceAll = function () {
        var set = this.ratee;
        set.tunes.forEach(function (tune) {
            tune.dummyStandard = set.dummyStandard;
            tune.update();
        });
        set.updatePerformance(true);

        $scope.sets.splice($scope.sets.indexOf(set), 1);
        $scope.sets.push(set);
    };
};