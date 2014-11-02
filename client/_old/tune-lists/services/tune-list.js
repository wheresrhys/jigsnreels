require('src/common/data/database');
require('src/common/ui/modals');
require('src/tune/services/tune-model');
require('src/common/services/page-state');

var _ = require('lodash');

require('angular').module('jnr.tune-lists').factory('jTuneList', function (
    $rootScope, 
    jDatabase, 
    jModals,
    jPageState,
    jTune
) {

    var allTunes = jDatabase.getTable('tunes'),

        expandTune = function (opts) {
            opts = opts || {};
            $rootScope.activeTune = this.tune;
            this.propertiesCollapsed = !opts.edit;
            this.showPerformance = !opts.noPerformance;
            jModals.open('tuneViewer', this);
        },

        update = function () {
            this.tune.update();
        },

        tuneListFactory = function (conf) {
            return new TuneList(conf);
        },

        TuneList = function (conf) {
            this.conf = conf;
            this.init();
        };

    TuneList.prototype = {
        
        init: function () {
            var self = this;
            this.$scope = this.conf.$scope;
            
            this.tuneModifier = this.conf.tuneModifier || function () {};
            this.listName = this.conf.listName || 'tunes';
            this.setParams(this.conf);
            this.tuneCount = 0;

            if (!allTunes.length) {
                this.$scope.$on('jDataLoaded', function () {
                    self.populateList();
                });
            } else {
                this.populateList();
            }

            this.$scope.expandTune = this.$scope.expandTune || expandTune;
            this.$scope.update = this.$scope.update || update;
        },
        setParams: function (conf) {
            this.sort = conf.sort !== undefined ? conf.sort : this.sort;
            this.filter = conf.filter !== undefined ? conf.filter : this.filter;
            this.limit = conf.limit !== undefined ? conf.limit :
                        this.limit === undefined ? 15 : this.limit;
        },
        populateList: function () {
            var self = this,
                tunes = [];

            allTunes.map(function (tune) {
                var aggregates = jTune.extract(tune, {
                    performanceFilter: function (perf) {
                        return perf.instrument === $rootScope.pageState.instrument;
                    },
                    list: tunes
                }, {
                    modifier: self.tuneModifier
                });
            });
            if (this.filter) {
                tunes = _.filter(tunes, this.filter);    
            }
            this.tuneCount = tunes.length;
            if (this.sort) {
                tunes = _.sortBy(tunes, this.sort);
            }
            if (this.limit) {
                this.selectedTunes = _.first(tunes, this.limit);
                this.otherTunes = _.rest(tunes, this.limit);
            } else {
                this.selectedTunes = tunes;
                this.otherTunes = [];
            }
            this.$scope[this.listName] = this.selectedTunes;
            this.$scope.$emit('tunesListed', this);
        },
        relist: function (conf) {
            var oldLimit = this.limit;
            if (!conf.forceRelist) {
                if (conf.sort && conf.sort === this.sort) {
                    delete conf.sort;
                }
                if (conf.filter && conf.filter === this.filter) {
                    delete conf.filter;
                }
                if (!conf.filter && !conf.sort && conf.limit === undefined) {
                    return;
                }
            }
            this.setParams(conf);

            if (conf.sort || conf.filter) {
                this.populateList();
            } else if (typeof conf.limit !== 'undefined') {
                //change the size of the list
                if (this.limit === 0 && oldLimit !== 0) {
                    Array.prototype.push.apply(this.selectedTunes, this.otherTunes);
                    this.otherTunes = [];
                } else if (oldLimit > this.limit) {
                    Array.prototype.unshift.apply(this.otherTunes, this.selectedTunes.splice(this.limit, oldLimit - this.limit));
                } else if (oldLimit < this.limit) {
                    Array.prototype.push.apply(this.selectedTunes, this.otherTunes.splice(0, this.limit - oldLimit));
                }
            } else {
                this.populateList();
            }
        },
        moveToBottom: function (tune) {
            var self = this;
            this.selectedTunes.splice(this.selectedTunes.indexOf(tune), 1);
            if (this.otherTunes.length) {
                this.otherTunes.push(tune);
                this.selectedTunes.push(this.otherTunes.shift());
            } else {
                // timeout prevents a move event triggering instead of a leave event
                // and hence makes sure the animation happens
                setTimeout(function () {
                    self.selectedTunes.push(tune);
                }, 1);
            }
        },
        remove: function (tune) {
            var index = this.selectedTunes.indexOf(tune);
            this.selectedTunes.splice(index, 1 );
            this.lastRemoved = [index, tune];
            this.$scope.lastRemoved = true;
            if (this.otherTunes.length) {
                this.selectedTunes.push(this.otherTunes.shift());
            }
        },
        undoRemove: function () {
            this.otherTunes.unshift(this.selectedTunes.pop());
            this.selectedTunes.splice(this.lastRemoved[0], 0, this.lastRemoved[1]);
            this.$scope.lastRemoved = false;
            this.lastRemoved = null;
        }
    };

    return tuneListFactory;
}); 