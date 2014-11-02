var _ = require('lodash');

require('src/common/ui/modals');
require('src/tune/ui/tune-heading');
require('src/tune/ui/performance-rater');
require('src/tune-lists/services/tune-list');

module.exports = function (
    $scope,
    $rootScope,
    jTuneList,
    jModals
) {

    $rootScope.showNewTunes = false;

    var getPerformanceForInstrument = function (tune, instrument) {
            return (_.findWhere(tune.tune.performances, {
                    instrument: instrument
                }) || {
                    instrument: instrument,
                    dummy: true
                });
        },
        isNew = function (tune) {
            return tune.isNew();
        };

    $scope.lastTuneRemoved;

    $scope.finished = function () {
        tuneList.remove(this.tune);
        if (!$scope.newTunes.length) {
            $rootScope.showNewTunes = false;
        }
    };

    $scope.undo = function () {
        tuneList.undoRemove();
    };

    $scope.update = function (oldValue) {
        this.tune.update({
            oldProps: oldValue,
            setPublicPerformance: true
        });       
    }; 

    var performanceEditor;

    $scope.editPerformanceForInstrument = function (instrument) {
        this.tune.performance = getPerformanceForInstrument(this.tune, instrument);
        this.instrument = instrument;
        performanceEditor = jModals.open('performanceEditor', this);
    };
    /* istanbul ignore next: tricky to test */
    $scope.finishPerformanceEdit = function (tune) {
        tune.performance = {
            dummy: true
        };
        performanceEditor.dismiss();
    };

    var tuneList = jTuneList({
        $scope: $scope,
        listName: 'newTunes',
        filter: isNew,
        limit: 4
    });

    $rootScope.newTuneCount = tuneList.tuneCount;
    $scope.$on('tunesListed', function (event, tuneList) {
        $rootScope.newTuneCount = tuneList.tuneCount;
    });

    $rootScope.$on('newTunesFetched', function (event) {
        tuneList.relist({
            forceRelist: true
        });
    });
};