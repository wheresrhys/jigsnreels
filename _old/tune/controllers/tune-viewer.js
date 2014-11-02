'use strict';
var angular = require('angular');
require('src/tune/ui/draw-score');
require('src/tune/ui/performance-rater');
require('src/common/ui/modals');

module.exports = function (
    $scope, 
    jModals
) {

    $scope.tune = $scope.activeTune;
    $scope.tune.dummyStandard = -1;
    $scope.editingAbc = false;
    $scope.isNewAbc = false;

    var oldArrangementValue,
        arrangementConfirm;

    $scope.update = function (redrawScore) {

        if($scope.tune.update({
            performance: $scope.tune.performance,
            setPublicPerformance: true,
            updateScore: redrawScore
        }).practiced) {
            $scope.$dismiss();
        }
    };

    $scope.editAbc = function () {
        $scope.editableScoreGenerator = angular.copy($scope.tune.scoreGenerator);  
        $scope.editingAbc = true;
        $scope.isNewAbc = false;
    };

    $scope.newAbc = function () {
        $scope.editableScoreGenerator = angular.copy($scope.tune.scoreGenerator);  
        $scope.editableScoreGenerator.arrangement.abc = ''; 
        $scope.editingAbc = true;
        $scope.isNewAbc = true;
    };

    $scope.updateArrangement = function (oldValue) {
        oldArrangementValue = oldValue;
        arrangementConfirm = jModals.open('arrangementConfirm', $scope);
    };

    $scope.saveThisAbc = function () {
        $scope.tune.arrangement.abc = editedAbc;
        editedAbc = null;
        $scope.tune.update({
            updateScore: true
        });
        abcConfirm.dismiss();
    };

    $scope.saveNewAbc = function () {
        var newArrangement = angular.extend({}, $scope.tune.arrangement);
        newArrangement.abc = editedAbc;
        editedAbc = null;
        $scope.tune.update({
            arrangement: newArrangement,
            useArrangement: true
        });
        abcConfirm && abcConfirm.dismiss();
    };

    var editedAbc,
        abcConfirm;

    $scope.saveAbcDialog = function () {

        
        editedAbc = $scope.editableScoreGenerator.arrangement.abc;
        
        $scope.editingAbc = false;
        if ($scope.isNewAbc) {
            $scope.saveNewAbc();
        } else {
            abcConfirm = jModals.open('abcConfirm', $scope);
        }
    };

    $scope.cancelAbcEdit = function () {
        $scope.editingAbc = false;
    };

    $scope.alterArrangement = function () {
        $scope.tune.update({
            updateScore: true
        });
        arrangementConfirm.dismiss();
    };

    $scope.cancelArrangementEdit = function () {
        angular.extend($scope.tune.arrangement, oldArrangementValue);
        oldArrangementValue = null;
        arrangementConfirm.dismiss();
    };

    $scope.saveNewArrangement = function () {
        var newArrangement = angular.extend({}, $scope.tune.arrangement);
        angular.extend($scope.tune.arrangement, oldArrangementValue);
        oldArrangementValue = null;
        $scope.tune.update({
            arrangement: newArrangement,
            useArrangement: true
        });
        arrangementConfirm.dismiss();
    };


    $scope.saveAbcToPerformance = function (newPerformance) {
        if (newPerformance) {
            $scope.tune.update({
                performance: {
                    dummy: true,
                    arrangement: $scope.tune.arrangement._id,
                    instrument: $scope.tune.performance.instrument
                },
                setPublicPerformance: true
            });
        } else {
            $scope.tune.performance.arrangement = $scope.tune.arrangement._id;
            $scope.tune.update();
        }
        
        $scope.abcSavePending = false;
    };

    $scope.revertAbc = function () {
        $scope.tune.resetArrangement();
        $scope.abcSavePending = false;
    };

    $scope.abcSavePending = false;

    $scope.nextAbc = function () {
        var arrangements = $scope.tune.tune.arrangements;
        $scope.tune.nextArrangement();
        // $scope.tune.arrangement = arrangements[(arrangements.indexOf($scope.tune.arrangement) + 1) % arrangements.length];
        $scope.abcSavePending = ($scope.tune.arrangement._id !== $scope.tune.performance.arrangement);
    };
};