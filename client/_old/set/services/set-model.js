var angular = require('angular'),
    _ = require('lodash');

// require('src/tune/services/abc-parser');

require('angular').module('jnr.set').factory('jSet', function (
    $routeParams,
    $rootScope,
    jDatabase,
    jTune
) {

    var tunesFetched = false;
        
    var Set = function (set, opts) {
        this.set = set;
        this.opts = opts || {};
        this.init();
    };

    Set.prototype = {
        init: function () {
            var self = this;
            this.overflow = 6 - this.set.tunes.length;
            if (!tunesFetched) {
                jDatabase.getTable('tunes').$promise.then(function () {
                    tunesFetched = true;
                    this.setTunes();
                }.bind(this));
                this.performance = {
                    standard: -1,
                    best: -1,
                    lastPracticed: 0
                };
            } else {
                this.setTunes();
            }
        },
        setTunes: function () {
            if (this.set.tunes) {
                this.tunes = this.set.tunes.map(function (arrangement) {
                    return jTune.getForArrangement(arrangement, $rootScope.pageState.instrument);                
                });   
                
                this.updatePerformance();
            } else {
                this.tunes = [];
            }
            
        },
        updatePerformance: function (practiced) {
            
            this.dummyStandard = -1;
            this.performance = {
                standard: this.tunes.reduce(function (prevVal, tune) {
                    return Math.min(prevVal, tune.performance.standard);
                }, 5),
                best: this.tunes.reduce(function (prevVal, tune) {
                    return Math.min(prevVal, tune.performance.best);
                }, 5),
                lastPracticed: //practiced ? Date.now() : 
                this.tunes.reduce(function (prevVal, tune) {
                    if (typeof prevVal === 'undefined') {
                        return (new Date(tune.performance.lastPracticed).getTime());
                    }
                    return Math.min(prevVal, (new Date(tune.performance.lastPracticed)).getTime());
                }, undefined)
            }; 
        }

    };

    return Set;
       
});
