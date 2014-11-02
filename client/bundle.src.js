require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"src/app":[function(require,module,exports){
module.exports=require('MpjZaV');
},{}],"MpjZaV":[function(require,module,exports){
var angular = require('angular');

require('src/tune-lists/module');
require('src/set-lists/module');
require('angular-bootstrap');
require('angular-resource');
require('angular-cookies');
require('angular-route');
require('angular-animate');

var app = angular.module('jnr', [
    'ngResource',
    'ngCookies',
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'jnr.tune-lists',
    'jnr.set-lists'
]);

app.value('jNow', new Date())
    .config(function ($locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');   
    });

module.exports = app
 .config(function ($routeProvider) {
    
        $routeProvider.otherwise({
            redirectTo: '/sets/list/mandolin'
        });
    });

 
},{"angular":false,"angular-animate":false,"angular-bootstrap":false,"angular-cookies":false,"angular-resource":false,"angular-route":false,"src/set-lists/module":"Fi6dAY","src/tune-lists/module":"mKFmtN"}],"aaMb1q":[function(require,module,exports){
module.exports = function (
    $scope, 
    $rootScope, 
    $location, 
    jPageState,
    jModals
) {
    $scope.currentUrl = $location.path();
    $scope.pageState = jPageState.get();
    $scope.isCollapsed = true;
    
    $rootScope.$on('locationChangeStart', function () {
        $scope.isCollapsed = true;
    });

    $scope.toggleNewTunes = function () {
        $rootScope.showNewTunes = !$rootScope.showNewTunes;
    };

    $scope.addTune = function () {
        jModals.open('addTune');
    };
};

},{}],"src/common/controllers/top-nav":[function(require,module,exports){
module.exports=require('aaMb1q');
},{}],"GpfO9m":[function(require,module,exports){
module.exports = function($rootScope, $resource, $http) {
    var tables = {},
        resources = {},
        updateFromTheSession = function() {
            $http({
                method: 'GET',
                url: '/rest/scraper'
            })
                .success(function(data, status, headers, config) {
                    data.map(function(item) {
                        tables.tunes.push(new resources.tunes(item));
                    });
                    if (data.length) {
                        $rootScope.$broadcast('newTunesFetched');
                    }
                });
        },

        initResource = function(resourceName, asTable) {
            resources[resourceName] = $resource('/rest/' + resourceName + '/:id', {
                id: '@_id'
            }, {
                'get': {
                    method: 'GET',
                    cache: true
                },
                'update': {
                    method: 'PUT'
                }
                // 'query' : { method:'GET', cache: true, isArray: true }
            });
            if (asTable) {
                tables[resourceName] = resources[resourceName].query(function(result) {
                    $rootScope.$broadcast('jDataLoaded', resourceName);
                });

                if (resourceName === 'tunes') {
                    updateFromTheSession();
                }
                return tables[resourceName];
            }

            return resources[resourceName];
            // },

            // init = function () {
            //     var resourceNames = Array.prototype.slice.apply(arguments);

            //     for (var i = resourceNames.length; --i; i>-1) {
            //         if (!resources[resourceNames[i]]) {
            //             initResource(resourceNames[i]);
            //         }
            //     }
        };

    return {
        getTable: function(name) {
            return tables[name] || initResource(name, 'table');
        },
        getResource: function(name) {
            return resources[name] || initResource(name);
        } //,
        // init: init

    };
};
},{}],"src/common/data/database":[function(require,module,exports){
module.exports=require('GpfO9m');
},{}],"src/common/data/dropdowns":[function(require,module,exports){
module.exports=require('PDNe9n');
},{}],"PDNe9n":[function(require,module,exports){
module.exports = function($rootScope) {
    var dropdowns = {
        playback: [{
            value: 0,
            label: 'Novice'
        }, {
            value: 1,
            label: 'Hand-holding'
        }, {
            value: 2,
            label: 'Sloppy/Slow'
        }, {
            value: 3,
            label: 'Playalong'
        }, {
            value: 4,
            label: 'Starter'
        }, {
            value: 5,
            label: 'Solo'
        }],
        popularity: [{
            value: 0,
            label: 'Unknown'
        }, {
            value: 1,
            label: 'Rare'
        }, {
            value: 2,
            label: 'Common'
        }, {
            value: 3,
            label: 'Standard'
        }],
        rating: [{
            value: 1,
            label: 'Mediocre'
        }, {
            value: 2,
            label: 'Run of the mill'
        }, {
            value: 3,
            label: 'Pretty good'
        }, {
            value: 4,
            label: 'Really nice'
        }, {
            value: 5,
            label: 'Special'
        }],
        difficulty: [{
            value: 1,
            label: 'Easy-peasy'
        }, {
            value: 2,
            label: 'Straightforward'
        }, {
            value: 3,
            label: 'Tricky Bits'
        }, {
            value: 4,
            label: 'Really hard'
        }],
        rhythm: [
            'jig',
            'reel',
            'slip jig',
            'hornpipe',
            'polka',
            'slide',
            'waltz',
            'barndance',
            'strathspey',
            'three-two',
            'mazurka'
        ],
        root: [
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'Bb',
            'Eb',
            'Ab',
            'Db',
            'F#',
            'C#',
            'G#'
        ],
        mode: [
            'maj',
            'min',
            'mix',
            'dor',
            'aeo'
        ]
    };

    $rootScope.dropdowns = dropdowns;

    return dropdowns;
};
},{}],"XxoOEQ":[function(require,module,exports){
'use strict';
var angular = require('angular');
require('angular-resource');

module.exports = angular.module('jnr.common', ['ngResource'])
    
    .directive('jSelectOnClick', require('./ui/select-on-click'))
    .filter('capitalise', require('./ui/capitalise'))
    .service('jModals', require('./ui/modals'))
    .service('readCookie', require('./services/read-cookie'))
    .service('jPageState', require('./services/page-state'))
    .service('jDatabase', require('./data/database'))
    .service('jDropdowns', require('./data/dropdowns'))
    .controller('topNav', require('./controllers/top-nav'))
;
},{"./controllers/top-nav":"aaMb1q","./data/database":"GpfO9m","./data/dropdowns":"PDNe9n","./services/page-state":"mGISb5","./services/read-cookie":"kvUSy6","./ui/capitalise":"Z4XqQn","./ui/modals":"Bdfl6Z","./ui/select-on-click":"gJd0X8","angular":false,"angular-resource":false}],"src/common/module":[function(require,module,exports){
module.exports=require('XxoOEQ');
},{}],"mGISb5":[function(require,module,exports){
module.exports = function ($rootScope, $cookies) {
    var params = {};
    $rootScope.pageState = params;
    return {
        set: function (data) {
            // params = data;
            for (var key in data) {
                params[key] = data[key];
                if (key === 'instrument') {
                    $cookies.instrument = data.instrument;
                }
                
            }
        },
        get: function (prop) {
            return prop ? params[prop] : params;
        }
    };
};

},{}],"src/common/services/page-state":[function(require,module,exports){
module.exports=require('mGISb5');
},{}],"src/common/services/read-cookie":[function(require,module,exports){
module.exports=require('kvUSy6');
},{}],"kvUSy6":[function(require,module,exports){
'use strict';

/* istanbul ignore next: copied */ 
module.exports = function readCookie (name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            /* istanbul ignore next: copied */ 
            c = c.substring(1,c.length);
        }
        /* istanbul ignore if: copied */ 
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length,c.length);
        }
    }
    return null;
};
},{}],"Z4XqQn":[function(require,module,exports){
'use strict';

module.exports = function() {
    return function(input) {
        return input.charAt(0).toUpperCase() + input.substr(1);
    };
};

},{}],"src/common/ui/capitalise":[function(require,module,exports){
module.exports=require('Z4XqQn');
},{}],"Bdfl6Z":[function(require,module,exports){
'use strict';

module.exports = function ($modal) {
    
    var configs = {
        tuneViewer: {
            templateUrl: '/src/tune/tpl/tune-viewer.html',
            controller: 'tuneViewer',
            windowClass:  'tune-viewer fade'
        },
        addTune: {
            templateUrl: '/src/tune/tpl/add-tune.html',
            controller: 'addTune',
            windowClass:  'add-tune fade'
        },
        performanceEditor: {
            templateUrl: '/src/tune/tpl/performance-editor.html',
            windowClass:  'fade'
        },
        arrangementConfirm: {
            templateUrl: '/src/tune/tpl/arrangement-confirm.html',
            windowClass:  'fade'
        },
        abcConfirm: {
            templateUrl: '/src/tune/tpl/abc-confirm.html',
            windowClass:  'fade'
        }
    };

    return {
        open: function (type, scope) {
            var conf = configs[type] || /* istanbul ignore next: paranoid fallback */ {};
            scope && (conf.scope = scope);
            
            return $modal.open(conf);

        }
    };
};

},{}],"src/common/ui/modals":[function(require,module,exports){
module.exports=require('Bdfl6Z');
},{}],"src/common/ui/select-on-click":[function(require,module,exports){
module.exports=require('gJd0X8');
},{}],"gJd0X8":[function(require,module,exports){
'use strict';
module.exports = function () {
    return function (scope, element, attrs) {
        element.bind('click', function () {
            element[0].select();
        });
    };
};

},{}],"src/controllers":[function(require,module,exports){
module.exports=require('uVj9MF');
},{}],"uVj9MF":[function(require,module,exports){
// var angular = require('angular'),
//     listTunes = require('src/tune-lists/controllers/list-tunes'),
//     // viewTune = require('src/controllers/view-tune'),
//     // setBuilder = require('src/controllers/set-builder'),
//     // listSets = require('src/controllers/list-sets'),
//     newTunes = require('src/tune-lists/controllers/new-tunes'),
//     tuneViewer = require('src/controllers/modals/tune-viewer'),
//     addTune = require('src/controllers/modals/add-tune'),
//     topNav = require('src/controllers/include/top-nav');


// module.exports = function () {

//     angular.module('jnr')
//         .controller('listTunes', listTunes)
//         //.controller('viewTune', viewTune)
//         //.controller('setBuilder', setBuilder)
//         //.controller('listSets', listSets)
//         .controller('newTunes', newTunes)
//         .controller('tuneViewer', tuneViewer)
//         .controller('addTune', addTune)
//         .controller('topNav', topNav);

// };

},{}],"nbHEfk":[function(require,module,exports){
var angular = require('angular');
require('src/app');

angular.bootstrap(document, ['jnr']);
},{"angular":false,"src/app":"MpjZaV"}],"src/main":[function(require,module,exports){
module.exports=require('nbHEfk');
},{}],"JZdZmN":[function(require,module,exports){
// 'use strict';

// var readCookie = require('src/common/read-cookie');

// module.exports = function () {

//     require('angular').module('jnr').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        
//         $locationProvider.html5Mode(true).hashPrefix('!');   

//         $routeProvider.when('/tunes', {
//             templateUrl: '/views/list-tunes.html'
//         }).when('/tunes/:instrument', {
//             templateUrl: '/views/list-tunes.html'
//         // }).when('/tune/:id', {
//         //     templateUrl: '/views/tune.html'
//         // }).when('/tune/:id/:instrument', {
//         //     templateUrl: '/views/tune.html'
//         // }).when('/sets/new/', {
//         //     templateUrl: '/views/set-builder.html'
//         // }).when('/sets/list/', {
//         //     templateUrl: '/views/set-list.html'
//         // }).when('/sets/new/:instrument', {
//         //     templateUrl: '/views/set-builder.html'
//         // }).when('/sets/list/:instrument', {
//         //     templateUrl: '/views/set-list.html'
//         }).otherwise({
//             redirectTo: '/tunes/' + ( readCookie('instrument') || 'mandolin')
//         });
//     }]);
// };

    

},{}],"src/routes":[function(require,module,exports){
module.exports=require('JZdZmN');
},{}],"cijzCk":[function(require,module,exports){
// 'use strict';

// require('src/services/page-state');

// module.exports = function (
//     $scope,     
//     $routeParams, 
//     jPageState
// ) {
//     jPageState.set({
//         section: 'sets',
//         instrument: $routeParams.instrument,
//         subsection: 'new', 
//         path: '/sets/new'
//     });
// };

},{}],"src/set-builder/set-builder_controller":[function(require,module,exports){
module.exports=require('cijzCk');
},{}],"src/set-lists/controllers/list-sets":[function(require,module,exports){
module.exports=require('xfU5jY');
},{}],"xfU5jY":[function(require,module,exports){
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
},{"lodash":false,"src/common/services/page-state":"mGISb5","src/set/services/set-model":"eEBwhC"}],"src/set-lists/module":[function(require,module,exports){
module.exports=require('Fi6dAY');
},{}],"Fi6dAY":[function(require,module,exports){
'use strict';

require('src/common/module');
require('src/set/module');

var angular = require('angular'),
    readCookie = require('src/common/services/read-cookie'),
    setModule = angular.module('jnr.set-lists', ['jnr.common', 'jnr.set']),
    listSets = require('src/set-lists/controllers/list-sets');
    // addTune = require('src/set/controllers/add-set');
        

module.exports = setModule
    .controller('listSets', listSets)
    .config(function ($routeProvider) {
    
        $routeProvider.when('/sets/list/', {
            templateUrl: '/src/set-lists/tpl/list-sets.html'
        }).when('/sets/list/:instrument', {
            templateUrl: '/src/set-lists/tpl/list-sets.html'
        });
    });
},{"angular":false,"src/common/module":"XxoOEQ","src/common/services/read-cookie":"kvUSy6","src/set-lists/controllers/list-sets":"xfU5jY","src/set/module":"a5e9QZ"}],"a5e9QZ":[function(require,module,exports){
'use strict';

require('src/common/module');
require('src/tune/module');

var angular = require('angular'),
    setModule = angular.module('jnr.set', ['jnr.common', 'jnr.tune']);
    // setViewer = require('src/set/controllers/set-viewer'),
    // addTune = require('src/set/controllers/add-set');
        

module.exports = setModule;
    // .controller('setViewer', setViewer)
    // .controller('addTune', addTune);
},{"angular":false,"src/common/module":"XxoOEQ","src/tune/module":"Wotg+P"}],"src/set/module":[function(require,module,exports){
module.exports=require('a5e9QZ');
},{}],"src/set/services/set-model":[function(require,module,exports){
module.exports=require('eEBwhC');
},{}],"eEBwhC":[function(require,module,exports){
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

},{"angular":false,"lodash":false}],"src/tune-lists/controllers/list-tunes":[function(require,module,exports){
module.exports=require('spIL2A');
},{}],"spIL2A":[function(require,module,exports){
'use strict';

var liquidMetal = require('liquidmetal'),
    _ = require('lodash');

require('src/tune-lists/services/tune-list');
require('src/tune/ui/tune-heading');
require('src/tune/ui/performance-rater');
require('src/common/ui/select-on-click');
require('src/common/services/page-state');

module.exports = function (
    $scope, 
    $rootScope, 
    $routeParams, 
    jPageState, 
    jTuneList
) {
    var filters = {
            practice: function (tune) {
                return tune.tune.performances.length && (!$routeParams.instrument || _.filter(tune.tune.performances, function (performance) {
                    return performance.instrument === $routeParams.instrument && (performance.best > 2 || performance.special);
                }).length);
            },
            search: function (tune) {
                tune.searchScore = liquidMetal.score(tune.tune.name, $scope.searchTerm.replace(/\s/g, ''));
                return tune.searchScore > 0.3;
            }
        },
        sorters = {
            practice: function (tune) {
                var performance = tune.performance || tune._createPerformance(),
                    gap = performance.best - performance.standard,
                    difficulty = performance.difficulty === -1 ? 0 : performance.difficulty,
                    rating = tune.tune.rating === -1 ? 0 : tune.tune.rating,
                    popularity = tune.tune.popularity === -1 ? 0 : tune.tune.popularity,
                    practiceUrgency = 0,
                    uniqueVersion = tune.tune.performances.length < 2,
                    tuneRank = (performance.special * 5) + (1.5 * rating) + popularity + uniqueVersion;

                if (performance.best > 2 || performance.special) {
                    practiceUrgency = (gap + (difficulty / 2) + 1);
                    if (performance.standard < 3) {
                        practiceUrgency += gap;
                    }
                    if (performance.special && performance.best < 3 ) {
                        practiceUrgency += 2;
                    }
                } else {
                    practiceUrgency = (gap - (difficulty / 2) + 1);
                }
                tune.practiceRank = tuneRank * practiceUrgency * (tune.daysSinceLastPractice + 1);
                return -tune.practiceRank;
            },
            search: function (tune) {
                return -tune.searchScore; 
            }
        },
        getFilter = function (filterTerm) {
            var modeTerm = $scope.filterMode.trim(),
                rhythmTerm = $scope.filterRhythm.trim();

            var allTuneRhythms = $rootScope.dropdowns.rhythm,
                rhythms = {
                    included: [],
                    excluded: []
                };

            if (rhythmTerm) {
                rhythmTerm = rhythmTerm.split('|');
                for (var key in allTuneRhythms) {
                    if (rhythmTerm.indexOf(allTuneRhythms[key]) > -1) {
                        rhythms.included.push(allTuneRhythms[key]);
                    }
                    if (rhythmTerm.indexOf('!' + allTuneRhythms[key]) > -1) {
                        rhythms.excluded.push(allTuneRhythms[key]);
                    }
                }
            }

            if (modeTerm && /^(\!?([ABCDEFG](#|b)?)?([a-z]{3})?(\|)?)+$/.test(modeTerm)) {
                var modes = [],
                    mode,
                    modeMatchers = {
                        and: [],
                        or: []
                    };
                // modeTerm = modeTerm.replace(/\([^(]+\)/g, function ($1) {
                //     modes.push($1.substr(1, $1.length - 2));
                //     return '';
                // });

                modes = modes.concat(modeTerm);

                for (mode in modes) {
                    getSingleModeFilter(modes[mode], modeMatchers);
                }
                // filter by e.g G|aeo Dmaj, mix|maj. case sensitive, !G (not automatically becomes an and)

            }
            
            return function (tune) {
                if (rhythmTerm) {
                    if ((rhythms.included.length && rhythms.included.indexOf(tune.tune.rhythm) === -1) || (rhythms.excluded.length && rhythms.excluded.indexOf(tune.tune.rhythm) > -1)) {
                        return false;
                    }

                }

                if (modeMatchers) {
                    return runMatchers(tune, modeMatchers);
                }

                return true;
            };
            
        },

        getSingleModeFilter = function (mode, matchers) {
            // if (!mode) {
            //     return;
            // }
            var statements;
            // if (mode.indexOf('|!') > -1) {
            //     statements = mode.split('|!');
            //     statements.map(function (item, index) {
            //         getSingleModeFilter(index !== 0 ? '!' : '' + item, matchers);
            //     });
            //     return;
            // }
            if (/[a-z]\|[A-Z]/.test(mode)) {
                (function () {
                    var statements = mode.split('|'),
                        i, 
                        il,
                        statement = '';

                    for (i = 0, il = statements.length; i<il; i++) {
                        if (!statement) {
                            statement = statements[i];
                        } else {
                            /* istanbul ignore else: other code prevents it ever running */
                            if (/[a-z]/.test(statement.charAt(statement.length - 1)) && /[A-Z]/.test(statements[i].charAt(0))) {
                                getSingleModeFilter(statement, matchers);
                            }
                            statement = statements[i];
                        }
                    }   
                    getSingleModeFilter(statement, matchers);

                    
                }());
                return;
            }
            var roots = mode.match(/[A-Z]/g),
                modes = mode.match(/[a-z]{3}/g),
                negated = mode.indexOf('!') === 0;

            var matcher = function (tune) {
                var matches = true;
                if (roots) {
                    matches = matches && roots.indexOf(tune.arrangement.root) > -1;
                } 
                if (modes) {
                    matches = matches && modes.indexOf(tune.tune.mode) > -1;
                }
                
                return negated ? !matches : matches;
            };

            matchers[negated ? 'and' : 'or'].push(matcher);
        },

        runMatchers = function (tune, matchers) {
            var matcher,
                result = false;
            if (matchers.or.length) {
                for (matcher in matchers.or) {
                    if (matchers.or[matcher](tune)) {
                        result = true;
                        break;
                    }
                }
            } else {
                result = true;
            }

            if (matchers.and.length) {
                for (matcher in matchers.and) {
                    if (!matchers.and[matcher](tune)) {
                        return false;
                    }
                }
            }

            return result;
        };

    function updateCounts () {
        if ($scope.searchTerm) {return;}
        var allTunes = Array.prototype.concat.apply(tuneList.selectedTunes, tuneList.otherTunes);
        $scope.counts = [
            allTunes.length,
            {
                now: _.filter(allTunes, function (tune) {
                    return tune.performance.standard === 1;
                }).length,
                past: _.filter(allTunes, function (tune) {
                    return tune.performance.best === 1;
                }).length
            },
            {
                now: _.filter(allTunes, function (tune) {
                    return tune.performance.standard === 2;
                }).length,
                past: _.filter(allTunes, function (tune) {
                    return tune.performance.best === 2;
                }).length
            },
            {
                now: _.filter(allTunes, function (tune) {
                    return tune.performance.standard === 3;
                }).length,
                past: _.filter(allTunes, function (tune) {
                    return tune.performance.best === 3;
                }).length
            },
            {
                now: _.filter(allTunes, function (tune) {
                    return tune.performance.standard === 4;
                }).length,
                past: _.filter(allTunes, function (tune) {
                    return tune.performance.best === 4;
                }).length
            },
            {
                now: _.filter(allTunes, function (tune) {
                    return tune.performance.standard === 5;
                }).length,
                past: _.filter(allTunes, function (tune) {
                    return tune.performance.best === 5;
                }).length
            }
        ];

        $scope.counts.toScratch = {
            now: _.filter(allTunes, function (tune) {
                return tune.performance.standard > 2;
            }).length,
            past: _.filter(allTunes, function (tune) {
                return tune.performance.best > 2;
            }).length
        };
    }

    $scope.update = function () {
        // if (this.tune.dummyStandard > -1) {
        //     tuneList.moveToBottom(this.tune);    
        // }

        this.tune.update({
            performance: this.tune.performance,
            setPublicPerformance: true
        });
        
        //updateCounts();
    };

    $scope.searchTerm = '';
    $scope.filterMode = '';
    $scope.filterRhythm = '';
    $scope.summaryCollapsed = true;
    $rootScope.$on('tunePracticed', function (event, tune) {
        tuneList.moveToBottom(tune);
        updateCounts();

    });

    $scope.search = function () {
        if ($scope.searchTerm.trim().length > 3) {
            $scope.filterMode = '';
            $scope.filterRhythm = '';
            tuneList.relist({
                filter: filters.search,
                sort: sorters.search,
                forceRelist: true,
                limit: 0
            });
        } else {
            tuneList.relist({
                filter: filters.practice,
                sort: sorters.practice,
                limit: 15
            });
        }
    };

    $scope.filter = function () {
        
        if ($scope.filterMode.trim() || $scope.filterRhythm.trim()) {
            $scope.searchTerm = '';
            tuneList.relist({
                filter: getFilter(),
                sort: sorters.practice,
                forceRelist: true,
                limit: ($scope.filterRhythm.trim() && $scope.filterMode.trim()) ? 0 : 20
            });
        } else {
            tuneList.relist({
                filter: filters.practice,
                sort: sorters.practice,
                limit: 15
            });
        }
    };

    $scope.filters = filters;
    $scope.sorters = sorters;

    jPageState.set({
        section: 'tunes',
        instrument: $routeParams.instrument,
        path: '/tunes'
    });

    var tuneList = jTuneList({
        $scope: $scope,
        filter: filters.practice,
        sort: sorters.practice,
        tuneModifier: function (tune) {
            tune.dummyStandard = -1;
        }
    });

    try {
        updateCounts();
    } catch (e) {
        $scope.$on('tunesListed', function (event, list) {
            
            // if (list === tuneList) {
            updateCounts();
            // }
        });
    }    
};
},{"liquidmetal":false,"lodash":false,"src/common/services/page-state":"mGISb5","src/common/ui/select-on-click":"gJd0X8","src/tune-lists/services/tune-list":"QJe3JN","src/tune/ui/performance-rater":"Mmq9nn","src/tune/ui/tune-heading":"m/R8wK"}],"wTptoU":[function(require,module,exports){
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
},{"lodash":false,"src/common/ui/modals":"Bdfl6Z","src/tune-lists/services/tune-list":"QJe3JN","src/tune/ui/performance-rater":"Mmq9nn","src/tune/ui/tune-heading":"m/R8wK"}],"src/tune-lists/controllers/new-tunes":[function(require,module,exports){
module.exports=require('wTptoU');
},{}],"src/tune-lists/module":[function(require,module,exports){
module.exports=require('mKFmtN');
},{}],"mKFmtN":[function(require,module,exports){
'use strict';

require('src/common/module');
require('src/tune/module');

var angular = require('angular'),
    tuneListsModule = angular.module('jnr.tune-lists', ['jnr.common', 'jnr.tune']),
    readCookie = require('src/common/services/read-cookie'),
    listTunes = require('src/tune-lists/controllers/list-tunes'),
    newTunes = require('src/tune-lists/controllers/new-tunes');
        
module.exports = tuneListsModule
    .controller('listTunes', listTunes)
    .controller('newTunes', newTunes)
    .config(function ($routeProvider) {
    
        $routeProvider.when('/tunes', {
            templateUrl: '/src/tune-lists/tpl/list-tunes.html'
        }).when('/tunes/:instrument', {
            templateUrl: '/src/tune-lists/tpl/list-tunes.html'
        });
    });


},{"angular":false,"src/common/module":"XxoOEQ","src/common/services/read-cookie":"kvUSy6","src/tune-lists/controllers/list-tunes":"spIL2A","src/tune-lists/controllers/new-tunes":"wTptoU","src/tune/module":"Wotg+P"}],"QJe3JN":[function(require,module,exports){
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
},{"angular":false,"lodash":false,"src/common/data/database":"GpfO9m","src/common/services/page-state":"mGISb5","src/common/ui/modals":"Bdfl6Z","src/tune/services/tune-model":"bTNFzr"}],"src/tune-lists/services/tune-list":[function(require,module,exports){
module.exports=require('QJe3JN');
},{}],"CkNMyn":[function(require,module,exports){
require('src/tune/ui/draw-score');
require('src/common/data/database');

module.exports = function (
    $scope,
    jTune
) {

    $scope.newTune = {
        performance: {}
    };

    $scope.save = function () {
        if (jTune.create($scope.newTune)) {
            $scope.$dismiss();
        } 
    };
    
};
},{"src/common/data/database":"GpfO9m","src/tune/ui/draw-score":"z4Lk0Z"}],"src/tune/controllers/add-tune":[function(require,module,exports){
module.exports=require('CkNMyn');
},{}],"src/tune/controllers/tune-viewer":[function(require,module,exports){
module.exports=require('oogQIt');
},{}],"oogQIt":[function(require,module,exports){
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
},{"angular":false,"src/common/ui/modals":"Bdfl6Z","src/tune/ui/draw-score":"z4Lk0Z","src/tune/ui/performance-rater":"Mmq9nn"}],"src/tune/module":[function(require,module,exports){
module.exports=require('Wotg+P');
},{}],"Wotg+P":[function(require,module,exports){
'use strict';

require('src/common/module');

var angular = require('angular'),
    tuneModule = angular.module('jnr.tune', ['jnr.common']);

module.exports = tuneModule
    .controller('tuneViewer', require('src/tune/controllers/tune-viewer'))
    .controller('addTune', require('src/tune/controllers/add-tune'))
    .filter('tuneStatSummary', require('src/tune/ui/tune-stat-summary'));
},{"angular":false,"src/common/module":"XxoOEQ","src/tune/controllers/add-tune":"CkNMyn","src/tune/controllers/tune-viewer":"oogQIt","src/tune/ui/tune-stat-summary":"zUpAse"}],"c5bVYC":[function(require,module,exports){
var scale = 'cdefgab',
    roots = [
        'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B', 
        'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
    ], 
    equivalentRoots = {
        'A#': 'Bb',
        'G#': 'Ab',
        'C#': 'Db',
        'D#': 'Eb',
        'Gb': 'F#',
        'Fb': 'E',
        'Cb': 'B',
        'B#': 'C',
        'E#': 'F'
    },
    modes = [
        'maj',
        undefined,
        'dor',
        undefined,
        'phr',
        'lyd',
        undefined,
        'mix',
        undefined,
        'min',
        undefined,
        'loc'
    ],
    majorKeySignatures = {
        Db: -5,
        Ab: -4,
        Eb: -3,
        Bb: -2,
        F: -1,
        C: 0,
        G: 1,
        D: 2,
        A: 3,
        E: 4,
        B: 5,
        'F#': 6
    },

    fullNoteRX = /(?:\=|_|\^)?[a-g](?:,|\')*/gi,
    accidentalsRX = /\=|_|\^/,
    lowNoteRX = /[A-G]/,
    
    extractedNotesCache = {},

    _getHighestOrLowestOfPair = function (note1, note2, highest) {
        
        //Start by identifying the lowest note
        
                    // compare octaves
        var result = note1[1] < note2[1]                                ? note1 :
                    note1[1] > note2[1]                                 ? note2 :
                    //compare position in scale
                    scale.indexOf(note1[0]) < scale.indexOf(note2[0])   ? note1 :
                    scale.indexOf(note1[0]) > scale.indexOf(note2[0])   ? note2 :
                    //compare flatness
                    note1[2] === '_' ? note1 : 
                    note2[2] === '_' ? note2 :
                    //compare naturalness
                    note1[2] === '=' ? note1 :
                    note2[2] === '=' ? note2 :
                    //compare not being sharp
                    !note1[2]        ? note1 :
                    !note2[2]        ? note2 :
                    // if we get here both notes are the same note sharpened in the same octve so doesn't matter which we return 
                                        note1;
        
        // if looking for highest return the one we didn't identify above    
        if (highest === true) {
            result = result === note1 ? note2 : note1;
        }
        return result;
    },

    _extractNotes = function (abc) {

        if (extractedNotesCache[abc]) {
            return extractedNotesCache[abc];
        }

        var notes = [];

        abc.replace(fullNoteRX, function ($0) {
            notes.push(_getNoteCoords($0));                
        });

        return extractedNotesCache[abc] = notes;
    },

    _getHighestOrLowestInAbc = function (abc, highest) {
        var notes = _extractNotes(abc),
            currentExtreme = notes[0];

        for (var n = 1, nl = notes.length; n<nl; n++) {
            currentExtreme = _getHighestOrLowestOfPair(currentExtreme, notes[n], highest);
        }

        return _getNoteFromCoords(currentExtreme);
    },
    
    // _getDuration = function (abcFragment) {
        
    //     var duration = 0;
    // },

    _getDirectionOfTransposition = function (direction, interval) {
        if (direction) {
            return direction > 0 ? 1 : -1;    
        } else {
            return interval < 5 ? 1: -1;
        }
    },

    _getNoteCoords = function (note) {
        var accidental;
        if (accidentalsRX.test(note.charAt(0))) {
            accidental = note.charAt(0);
            note = note.substr(1);
        }
        if (lowNoteRX.test(note.charAt(0))) {
            return [note.charAt(0).toLowerCase(), 1 - note.length, accidental];
        } else {
            return [note.charAt(0), note.length, accidental];
        }
    },

    _getNoteFromCoords = function (note) {
        var noteString;

        if (note[1] < 1) {
            noteString =  note[0].toUpperCase() + Array(1 - note[1]).join(',');
        } else {
            noteString =  note[0] + Array(note[1]).join('\'');
        }

        if (note[2]) {
            noteString = note[2] + noteString;
        }
        return noteString;
    },

    _keepInLimits = function (note, lowerBound, upperBound) {
        
        if (lowerBound) {
            lowerBound = _getNoteCoords(lowerBound);
            if (lowerBound[1] >= note[1]) {
                note[1] = lowerBound[1];
                if (scale.indexOf(note[0]) < scale.indexOf(lowerBound[0])) {
                    note[1]++;
                }
            }
        }

        if (upperBound) {
            upperBound = _getNoteCoords(upperBound);
            if (upperBound[1] <= note[1]) {
                note[1] = upperBound[1];
                if (scale.indexOf(note[0]) > scale.indexOf(upperBound[0])) {
                    note[1]--;
                }
            }
        }

        return note;
    },

    transpose = function (abcDef, opts) {
        var interval = scale.indexOf(opts.newRoot.substr(0, 1).toLowerCase()) - scale.indexOf(abcDef.root.substr(0, 1).toLowerCase()),
            direction = _getDirectionOfTransposition(opts.direction, interval),
            extraOctaves = opts.direction ? ((opts.direction / direction) - 1) : 0;
        
        if (direction < 0) {
            interval = -interval;
        }
        
        if (interval <= 0) {
            interval += 7;  
        }
         
        interval += extraOctaves * 7;
        
        return abcDef.abc.replace(fullNoteRX, function (note) {
            note = _getNoteCoords(note);

            var intervalWithinOctave = (interval * direction) % 7,
                newNoteIndex = scale.indexOf(note[0]) + intervalWithinOctave;

            note[0] = scale[(newNoteIndex + 7) % 7];

            note[1] += direction * Math.floor(interval / 7);

            if (newNoteIndex < 0 || newNoteIndex > 6) {
                note[1] += direction;  
            }

            note = _keepInLimits(note, opts.lowerLimit, opts.upperLimit);
            return _getNoteFromCoords(note);
            
        });

    },

    // getProps = function (abcDef) {

    //     return {
    //         lowest: getLowestNote(abcDef.abc, getSharpsAndFlats(abcDef.root, abcDef.mode)),
    //         highest: getHighestNote(abcDef.abc, getSharpsAndFlats(abcDef.root, abcDef.mode)),
    //         // first
    //         // last
    //         // leadInLength
    //         // leadIn
    //         keySignature: getSharpsAndFlats(abcDef.root, abcDef.mode)
    //     };
    // },

    getSharpsAndFlats = function (root, mode) {

        var equivalentMajorIndex = (roots.length + roots.indexOf(root) - modes.indexOf(mode)) % roots.length,
            equivalentMajor = roots[equivalentMajorIndex];

        equivalentMajor = equivalentRoots[equivalentMajor] || equivalentMajor;

        return majorKeySignatures[equivalentMajor];
    },

    getLowestNote = function (abc) {
        return _getHighestOrLowestInAbc(abc, false);
    },
    
    getHighestNote = function (abc) {
        return _getHighestOrLowestInAbc(abc, true);
    },
    clearExtractedNotes = function () {
        extractedNotesCache = {};
    };

module.exports = {
    transpose: transpose,
    extractNotes: _extractNotes,
    // getProps: getProps,
    getSharpsAndFlats: getSharpsAndFlats,
    getLowestNote: getLowestNote,
    getHighestNote: getHighestNote,
    clearExtractedNotes: clearExtractedNotes
};

},{}],"src/tune/services/abc-parser":[function(require,module,exports){
module.exports=require('c5bVYC');
},{}],"src/tune/services/score-snippets":[function(require,module,exports){
module.exports=require('s1LyC9');
},{}],"s1LyC9":[function(require,module,exports){
require('angular').module('jnr.tune').service('jScoreSnippets', function () {

    var indexedDB = window.indexedDB || null,
        snippetsDB = {
            open: function() {
                var version = 1;
                var request = indexedDB.open('score-snippets', version);

                request.onsuccess = function(e) {
                    snippetsDB.db = e.target.result;
                    // Do some more stuff in a minute
                };

                // We can only create Object stores in a versionchange transaction.
                request.onupgradeneeded = function(e) {
                    var db = e.target.result;

                    // A versionchange transaction is started automatically.
                    e.target.transaction.onerror = snippetsDB.onerror;

                    if(db.objectStoreNames.contains('snippets')) {
                        db.deleteObjectStore('snippets');
                    }

                    var store = db.createObjectStore('snippets', {keyPath: 'arrangementId'});
                };

                request.onerror = snippetsDB.onerror;
            },

            insert: function(arrangement, score) {
                if (!snippetsDB.inProgress[arrangement._id]) {
                    var db = snippetsDB.db;
                    var trans = db.transaction(['snippets'], 'readwrite');
                    var store = trans.objectStore('snippets');
                    
                    snippetsDB.inProgress[arrangement._id] = true;
                    var request = store.put({
                        arrangementId: arrangement._id,
                        score: score,
                        timestamp: (new Date()).toISOString()
                    });

                    request.onsuccess = function(e) {
                        // Re-render all the todo's
                        delete snippetsDB.inProgress[arrangement._id];
                    };

                    request.onerror = function(e) {
                        console.log(e.value);
                    };
                }
            },

            getById: function(id, success, failure) {
                var db = snippetsDB.db;
                var trans = db.transaction(['snippets'], 'readwrite');
                var store = trans.objectStore('snippets');

                var request = store.get(id);
                request.onerror = failure;
                request.onsuccess = function(event) {
                    var res = event.target.result;
                    if (res) {
                        success(res);
                    } else {
                        failure(res);
                    }

                };
            },

            inProgress: {}
        };

    if (indexedDB) {
        snippetsDB.open();
    }

    return {
        cacheScore: function (arrangement, score) {
            snippetsDB.insert(arrangement, score);
        },
        getCachedScore: function (arrangement, existsCallback, notExistsCallback) {
            snippetsDB.getById(arrangement._id, existsCallback, notExistsCallback);
        }
    };
});
},{"angular":false}],"src/tune/services/tune-model":[function(require,module,exports){
module.exports=require('bTNFzr');
},{}],"bTNFzr":[function(require,module,exports){
var angular = require('angular'),
    _ = require('lodash');

// require('src/tune/services/abc-parser');

require('angular').module('jnr.tune').factory('jTune', function(
    $routeParams,
    $rootScope,
    jDatabase
) {

    var dayLength = (1000 * 60 * 60 * 24);

    var Tune = function(tune, opts) {
        this.tune = tune;
        this.opts = opts || {};
        this.init();
    };

    Tune.extract = function(tune, opts, instanceOpts) {
        var jTunes = [],
            filter;

        opts = opts || {};
        instanceOpts = instanceOpts || {};

        if (opts.performanceFilter) {
            jTunes = _.filter(tune.performances, opts.performanceFilter).map(function(performance) {
                return new Tune(tune, angular.extend({}, instanceOpts, {
                    performance: performance
                }));
            });
        }

        if (!jTunes.length) {
            jTunes = [new Tune(tune, angular.extend({}, instanceOpts))];
        }


        if (opts.list) {
            Array.prototype.push.apply(opts.list, jTunes);
        }

        return jTunes;

    };

    Tune.create = function(data) {

        if (!(
            data.name &&
            data.abc &&
            data.root &&
            data.meter &&
            data.mode &&
            data.rhythm
        )) {
            return;
        }

        var performance,
            newTune = {
                sessionId: 0,
                name: data.name,
                arrangements: [{
                    abc: data.abc,
                    highestNote: '',
                    lowestNote: '',
                    variants: '',
                    root: data.root,
                    author: data.author || 'wheresrhys',
                }],
                alternativeNames: [],
                meter: data.meter,
                mode: data.mode,
                rhythm: data.rhythm,
                rating: data.rating || -1,
                popularity: data.popularity || -1,
                performances: [],
                notes: data.notes
            };

        if (data.performance.instrument) {
            performance = {
                standard: data.performance.standard || 0,
                notes: '',
                best: data.performance.standard || 0,
                difficulty: data.performance.difficulty || (-1),
                lastPracticed: data.performance.standard ? new Date() : new Date(0),
                special: !! data.performance.special,
                instrument: data.performance.instrument
            };
        }

        jDatabase.getResource('tunes').save(newTune, function(tune) {
            if (performance) {
                performance.arrangement = tune.arrangements[0]._id;
                performance.tune = tune._id;
                tune.performances.push(performance);
                tune.$update();
            }
            jDatabase.getTable('tunes').push(tune);
        });

        return true;
    };
    /* istanbul ignore next */
    Tune.getForArrangement = function(arrangement, instrument) {
        var tunesTable = jDatabase.getTable('tunes');
        var tune = _.findWhere(tunesTable, {
            _id: arrangement.tune
        });

        return new Tune(tune, {
            performance: _.findWhere(tune.performances, {
                arrangement: arrangement._id,
                instrument: instrument
            })
        });
    };

    Tune.prototype = {
        init: function() {
            // if (this.opts.scope) {
            //     // if (typeof this.opts.scope === 'boolean') {
            //     //     $scope.tune = this;
            //     //     this.$scope = $scope;
            //     // } else {
            //     this.scope = this.opts.scope;
            //     this.scope.tune = this;
            //     // }  
            // }

            this._assignArrAndPerf();
            this._setLastPracticedDays();
            this.opts.modifier && this.opts.modifier(this);
        },
        _assignArrAndPerf: function() {
            var that = this,
                defaultArrangement = this.tune.arrangements[0];
            if (this.opts.performance) {
                this.performance = this.opts.performance;
                this.arrangement = _.find(this.tune.arrangements, function(arrangement) {
                    return arrangement._id === that.performance.arrangement;
                });
            } else {
                this.performance = {
                    dummy: true
                };
                this.arrangement = defaultArrangement;
            }

            this.updateScore();
        },

        updateScore: function() {
            this.scoreGenerator = {
                arrangement: this.arrangement,
                meter: this.tune.meter,
                mode: this.tune.mode
            };
        },

        _setLastPracticedDays: function() {
            var milliseconds = ((new Date()) - (new Date(this.performance.lastPracticed || 0)));
            this.daysSinceLastPractice = +Math.round((milliseconds / dayLength), 0);
        },

        _performanceNeedsSaving: function(performance) {
            if (this.dummyStandard > -1) {
                return true;
            }
            for (var key in performance) {
                if (['instrument', 'dummy'].indexOf(key) === -1 && performance.hasOwnProperty(key)) {
                    return true;
                }
            }
            return false;
        },
        _performanceIsReal: function(performance) {
            return !performance.dummy;
        },

        _createPerformance: function(performance) {
            performance = performance || {};
            return {
                tune: this.tune._id,
                instrument: (performance && performance.instrument) || $rootScope.pageState.instrument,
                special: performance.special || false,
                lastPracticed: new Date(0),
                difficulty: performance.difficulty || -1,
                best: 0,
                notes: '',
                standard: 0,
                arrangement: this.arrangement._id
            };
        },

        _updatePerformance: function(opts) {

            var practiced = false,
                performance = opts.performance || this.performance;
            if (this._performanceNeedsSaving(performance)) {

                if (!this._performanceIsReal(performance)) {
                    performance = this._createPerformance(performance);
                    this.tune.performances.push(performance);
                }

                if (this.dummyStandard > -1) {
                    if (this.dummyStandard > 2) {
                        performance.special = false;
                    }
                    performance.standard = this.dummyStandard;
                    this.dummyStandard = -1;
                    performance.lastPracticed = new Date();
                    this._setLastPracticedDays();
                    $rootScope.$broadcast('tunePracticed', this);
                    practiced = true;

                }
                performance.best = Math.max(performance.best, performance.standard);

                if (opts.setPublicPerformance) {
                    this.performance = performance;
                }

            }
            return practiced;
        },
        isNew: function() {
            return this.tune.rating < 0; // || tune.popularity < 0;
        },
        resetArrangement: function() {
            var testId = this.performance.arrangement;
            this.arrangement = _.find(this.tune.arrangements, function(arrangement) {
                return arrangement._id === testId;
            });
            this.arrangementChangePending = false;
            this.updateScore();
        },

        nextArrangement: function() {
            this.arrangement = this.tune.arrangements[(this.tune.arrangements.indexOf(this.arrangement) + 1) % this.tune.arrangements.length];
            this.arrangementChangePending = (this.arrangement._id !== this.performance.arrangement);
            this.updateScore();
        },

        update: function(opts) {
            opts = opts || {};

            var that = this,
                oldProps = opts.oldProps || {},
                practiced = this._updatePerformance(opts);

            if (oldProps && oldProps.rating === -1 && !this.isNew()) {
                $rootScope.newTuneCount--;
            }

            if (opts.arrangement) {
                this.tune.arrangements.push(opts.arrangement);
                if (opts.arrangement._id) {
                    delete opts.arrangement._id;
                }
                opts.arrangement.tune = this.tune._id;
                this._sync(function(savedTune) {
                    if (opts.useArrangement) {
                        that.updateScore();
                        that.arrangement = savedTune.arrangements[savedTune.arrangements.length - 1];
                        that.performance.arrangement = that.arrangement._id;
                        that._sync();
                    }
                });
                this.arrangementChangePending = false;

            } else {
                this._sync();
            }

            if (opts.arrangement || opts.updateScore) {
                this.updateScore();
            }

            return {
                practiced: practiced
            };
        },

        _sync: function(callback) {
            var that = this,
                performanceIndex = this.tune.performances.indexOf(this.performance),
                arrangementIndex = this.tune.arrangements.indexOf(this.arrangement);

            this.tune.$update(function(savedTune) {
                that.performance = that.tune.performances[performanceIndex];
                that.arrangement = that.tune.arrangements[arrangementIndex];
                callback && callback(savedTune);
            });
        }

    };

    return Tune;

});
},{"angular":false,"lodash":false}],"src/tune/ui/draw-score":[function(require,module,exports){
module.exports=require('z4Lk0Z');
},{}],"z4Lk0Z":[function(require,module,exports){
'use strict';

require('src/tune/services/score-snippets');

var ABCJS = require('abcjs'),
    snippetsStore;

var ScoreDrawer = function (scoreGenerator, snippetOnly, el) {
    this.el = el;
    this.scoreGenerator = scoreGenerator;
    this.snippetOnly = snippetOnly;
    this.exec();
};

ScoreDrawer.prototype = {
    exec: function () {
        
        this.el.html('');


        this.arrangement = this.scoreGenerator.arrangement;

        if (!this.arrangement) {
            return;
        }

        this.abc = this.arrangement.abc;
        this.conf = {
            scale: 0.6,
            paddingtop: 0,
            paddingbottom: 0,
            paddingright: 0,
            paddingleft: 0
        };

        

        if (this.snippetOnly) {
            this.getSnippet();
        } else {
            this.renderScore();
        } 
    },

    getSnippet: function () {
        var self = this;

        this.el.addClass('score-snippet');

        snippetsStore.getCachedScore(this.arrangement, function (obj) {
            self.el.html(obj.score);
            self.el[0].style.width = self.el.find('svg')[0].getAttribute('width') + 'px';
        }, function () {
            self.abc = self.abc.replace(/^\|*:?/, '');
            self.abc = self.abc.split('|');
            self.abc = self.abc.slice(0, (self.abc[0].length < 4 ? 4 : 3)).join('|');
            self.conf.scale = 0.5;
            self.conf.staffwidth = 450;
            self.renderScore();
        });
    },

    renderScore: function () {
        var self = this;
        this.abc = 'X:1' +
        //'\nT:' + scoreGenerator.name + 
        '\nM:' + this.scoreGenerator.meter + 
        '\nL:1/8' + 
        //'\nR:' + scoreGenerator.rhythm + 
        '\nK:' + this.arrangement.root + this.scoreGenerator.mode + 
        '\n' + this.abc;

        setTimeout(function () {
            ABCJS.renderAbc(self.el[0], self.abc, {}, self.conf, {});  

            if (self.snippetOnly) {
                snippetsStore.cacheScore(self.arrangement, self.el[0].innerHTML);
            }  
        }, 100);        
    }

};

require('angular').module('jnr.tune').directive('jDrawScore', function (jScoreSnippets) {
    snippetsStore = jScoreSnippets;

    return {
        link: function(scope, el, attrs) {
            
            var snippetOnly = !!attrs.snippet;

            attrs.$observe('tune', function(value) {
                if (value) {
                    new ScoreDrawer(JSON.parse(value), snippetOnly, el);
                }
            });
        }
    };
});

},{"abcjs":false,"angular":false,"src/tune/services/score-snippets":"s1LyC9"}],"Mmq9nn":[function(require,module,exports){
'use strict';
require('angular').module('jnr.tune').directive('jPerformanceRater', function () {
    var colourings = 'default,danger,warning,success,info,primary'.split(',');
    return {
    // transclude: true,
        scope: true,
        templateUrl: '/src/tune/tpl/performance-rater.html',
        link: function (scope, element, attrs) {
            var ratee;
            try {
                ratee = JSON.parse(attrs.ratee);
            } catch (e) {
                ratee = scope[attrs.ratee || 'tune'];
            }
            
            scope.ratee = ratee;
            scope.colourings = colourings;
            scope.updatePerformance = function (rating) {
                ratee.dummyStandard = rating;
                attrs.callback ? scope[attrs.callback]() : ratee.update();
            };

            element.addClass('performance-rater');
        }
    };
});

},{"angular":false}],"src/tune/ui/performance-rater":[function(require,module,exports){
module.exports=require('Mmq9nn');
},{}],"m/R8wK":[function(require,module,exports){
require('src/tune/ui/tune-stat-summary');

require('angular').module('jnr.tune').directive('jTuneHeading', function () {
    return {
    // transclude: true,
        scope: true,
        templateUrl: '/src/tune/tpl/tune-heading.html',
        compile: function(element, attrs) {
            return function (scope, element, attrs) {
                var tune = scope[attrs.tune || 'tune'];
                
                scope.tune = tune.tune;
                scope.arrangement = tune.arrangement;
                if (attrs.stats) {
                    scope.stats = true;
                }
                element.addClass('tune-heading');
            };
        }
    };
});

},{"angular":false,"src/tune/ui/tune-stat-summary":"zUpAse"}],"src/tune/ui/tune-heading":[function(require,module,exports){
module.exports=require('m/R8wK');
},{}],"zUpAse":[function(require,module,exports){
'use strict';

require('src/common/data/dropdowns');

 

module.exports = function (jDropdowns) {
    return function(input) {
        var message = '';

        if (input.rating !== -1 || input.popularity !== -1) {
            message += 'A ';
            if (input.rating !== -1) {
                message += jDropdowns.rating[input.rating - 1].label.toLowerCase() + ' ';
            }
            if (input.popularity !== -1) {
                message += jDropdowns.popularity[input.popularity].label.toLowerCase() + ' ';
            }
            message += 'tune';
        }
        return message;
    };
};

},{"src/common/data/dropdowns":"PDNe9n"}],"src/tune/ui/tune-stat-summary":[function(require,module,exports){
module.exports=require('zUpAse');
},{}]},{},["MpjZaV","aaMb1q","GpfO9m","PDNe9n","XxoOEQ","mGISb5","kvUSy6","Z4XqQn","Bdfl6Z","gJd0X8","uVj9MF","JZdZmN","cijzCk","xfU5jY","Fi6dAY","a5e9QZ","eEBwhC","spIL2A","wTptoU","mKFmtN","QJe3JN","CkNMyn","oogQIt","Wotg+P","c5bVYC","s1LyC9","bTNFzr","z4Lk0Z","Mmq9nn","m/R8wK","zUpAse"])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvd2hlcmVzcmh5cy9TaXRlcy9qaWdzbnJlZWxzL3B1YmxpYy9zcmMvYXBwLmpzIiwiL1VzZXJzL3doZXJlc3JoeXMvU2l0ZXMvamlnc25yZWVscy9wdWJsaWMvc3JjL2NvbW1vbi9jb250cm9sbGVycy90b3AtbmF2LmpzIiwiL1VzZXJzL3doZXJlc3JoeXMvU2l0ZXMvamlnc25yZWVscy9wdWJsaWMvc3JjL2NvbW1vbi9kYXRhL2RhdGFiYXNlLmpzIiwiL1VzZXJzL3doZXJlc3JoeXMvU2l0ZXMvamlnc25yZWVscy9wdWJsaWMvc3JjL2NvbW1vbi9kYXRhL2Ryb3Bkb3ducy5qcyIsIi9Vc2Vycy93aGVyZXNyaHlzL1NpdGVzL2ppZ3NucmVlbHMvcHVibGljL3NyYy9jb21tb24vbW9kdWxlLmpzIiwiL1VzZXJzL3doZXJlc3JoeXMvU2l0ZXMvamlnc25yZWVscy9wdWJsaWMvc3JjL2NvbW1vbi9zZXJ2aWNlcy9wYWdlLXN0YXRlLmpzIiwiL1VzZXJzL3doZXJlc3JoeXMvU2l0ZXMvamlnc25yZWVscy9wdWJsaWMvc3JjL2NvbW1vbi9zZXJ2aWNlcy9yZWFkLWNvb2tpZS5qcyIsIi9Vc2Vycy93aGVyZXNyaHlzL1NpdGVzL2ppZ3NucmVlbHMvcHVibGljL3NyYy9jb21tb24vdWkvY2FwaXRhbGlzZS5qcyIsIi9Vc2Vycy93aGVyZXNyaHlzL1NpdGVzL2ppZ3NucmVlbHMvcHVibGljL3NyYy9jb21tb24vdWkvbW9kYWxzLmpzIiwiL1VzZXJzL3doZXJlc3JoeXMvU2l0ZXMvamlnc25yZWVscy9wdWJsaWMvc3JjL2NvbW1vbi91aS9zZWxlY3Qtb24tY2xpY2suanMiLCIvVXNlcnMvd2hlcmVzcmh5cy9TaXRlcy9qaWdzbnJlZWxzL3B1YmxpYy9zcmMvY29udHJvbGxlcnMuanMiLCIvVXNlcnMvd2hlcmVzcmh5cy9TaXRlcy9qaWdzbnJlZWxzL3B1YmxpYy9zcmMvbWFpbi5qcyIsIi9Vc2Vycy93aGVyZXNyaHlzL1NpdGVzL2ppZ3NucmVlbHMvcHVibGljL3NyYy9yb3V0ZXMuanMiLCIvVXNlcnMvd2hlcmVzcmh5cy9TaXRlcy9qaWdzbnJlZWxzL3B1YmxpYy9zcmMvc2V0LWJ1aWxkZXIvc2V0LWJ1aWxkZXJfY29udHJvbGxlci5qcyIsIi9Vc2Vycy93aGVyZXNyaHlzL1NpdGVzL2ppZ3NucmVlbHMvcHVibGljL3NyYy9zZXQtbGlzdHMvY29udHJvbGxlcnMvbGlzdC1zZXRzLmpzIiwiL1VzZXJzL3doZXJlc3JoeXMvU2l0ZXMvamlnc25yZWVscy9wdWJsaWMvc3JjL3NldC1saXN0cy9tb2R1bGUuanMiLCIvVXNlcnMvd2hlcmVzcmh5cy9TaXRlcy9qaWdzbnJlZWxzL3B1YmxpYy9zcmMvc2V0L21vZHVsZS5qcyIsIi9Vc2Vycy93aGVyZXNyaHlzL1NpdGVzL2ppZ3NucmVlbHMvcHVibGljL3NyYy9zZXQvc2VydmljZXMvc2V0LW1vZGVsLmpzIiwiL1VzZXJzL3doZXJlc3JoeXMvU2l0ZXMvamlnc25yZWVscy9wdWJsaWMvc3JjL3R1bmUtbGlzdHMvY29udHJvbGxlcnMvbGlzdC10dW5lcy5qcyIsIi9Vc2Vycy93aGVyZXNyaHlzL1NpdGVzL2ppZ3NucmVlbHMvcHVibGljL3NyYy90dW5lLWxpc3RzL2NvbnRyb2xsZXJzL25ldy10dW5lcy5qcyIsIi9Vc2Vycy93aGVyZXNyaHlzL1NpdGVzL2ppZ3NucmVlbHMvcHVibGljL3NyYy90dW5lLWxpc3RzL21vZHVsZS5qcyIsIi9Vc2Vycy93aGVyZXNyaHlzL1NpdGVzL2ppZ3NucmVlbHMvcHVibGljL3NyYy90dW5lLWxpc3RzL3NlcnZpY2VzL3R1bmUtbGlzdC5qcyIsIi9Vc2Vycy93aGVyZXNyaHlzL1NpdGVzL2ppZ3NucmVlbHMvcHVibGljL3NyYy90dW5lL2NvbnRyb2xsZXJzL2FkZC10dW5lLmpzIiwiL1VzZXJzL3doZXJlc3JoeXMvU2l0ZXMvamlnc25yZWVscy9wdWJsaWMvc3JjL3R1bmUvY29udHJvbGxlcnMvdHVuZS12aWV3ZXIuanMiLCIvVXNlcnMvd2hlcmVzcmh5cy9TaXRlcy9qaWdzbnJlZWxzL3B1YmxpYy9zcmMvdHVuZS9tb2R1bGUuanMiLCIvVXNlcnMvd2hlcmVzcmh5cy9TaXRlcy9qaWdzbnJlZWxzL3B1YmxpYy9zcmMvdHVuZS9zZXJ2aWNlcy9hYmMtcGFyc2VyLmpzIiwiL1VzZXJzL3doZXJlc3JoeXMvU2l0ZXMvamlnc25yZWVscy9wdWJsaWMvc3JjL3R1bmUvc2VydmljZXMvc2NvcmUtc25pcHBldHMuanMiLCIvVXNlcnMvd2hlcmVzcmh5cy9TaXRlcy9qaWdzbnJlZWxzL3B1YmxpYy9zcmMvdHVuZS9zZXJ2aWNlcy90dW5lLW1vZGVsLmpzIiwiL1VzZXJzL3doZXJlc3JoeXMvU2l0ZXMvamlnc25yZWVscy9wdWJsaWMvc3JjL3R1bmUvdWkvZHJhdy1zY29yZS5qcyIsIi9Vc2Vycy93aGVyZXNyaHlzL1NpdGVzL2ppZ3NucmVlbHMvcHVibGljL3NyYy90dW5lL3VpL3BlcmZvcm1hbmNlLXJhdGVyLmpzIiwiL1VzZXJzL3doZXJlc3JoeXMvU2l0ZXMvamlnc25yZWVscy9wdWJsaWMvc3JjL3R1bmUvdWkvdHVuZS1oZWFkaW5nLmpzIiwiL1VzZXJzL3doZXJlc3JoeXMvU2l0ZXMvamlnc25yZWVscy9wdWJsaWMvc3JjL3R1bmUvdWkvdHVuZS1zdGF0LXN1bW1hcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNoSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQzNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyk7XG5cbnJlcXVpcmUoJ3NyYy90dW5lLWxpc3RzL21vZHVsZScpO1xucmVxdWlyZSgnc3JjL3NldC1saXN0cy9tb2R1bGUnKTtcbnJlcXVpcmUoJ2FuZ3VsYXItYm9vdHN0cmFwJyk7XG5yZXF1aXJlKCdhbmd1bGFyLXJlc291cmNlJyk7XG5yZXF1aXJlKCdhbmd1bGFyLWNvb2tpZXMnKTtcbnJlcXVpcmUoJ2FuZ3VsYXItcm91dGUnKTtcbnJlcXVpcmUoJ2FuZ3VsYXItYW5pbWF0ZScpO1xuXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2pucicsIFtcbiAgICAnbmdSZXNvdXJjZScsXG4gICAgJ25nQ29va2llcycsXG4gICAgJ25nUm91dGUnLFxuICAgICduZ0FuaW1hdGUnLFxuICAgICd1aS5ib290c3RyYXAnLFxuICAgICdqbnIudHVuZS1saXN0cycsXG4gICAgJ2puci5zZXQtbGlzdHMnXG5dKTtcblxuYXBwLnZhbHVlKCdqTm93JywgbmV3IERhdGUoKSlcbiAgICAuY29uZmlnKGZ1bmN0aW9uICgkbG9jYXRpb25Qcm92aWRlcikge1xuICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSkuaGFzaFByZWZpeCgnIScpOyAgIFxuICAgIH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFwcFxuIC5jb25maWcoZnVuY3Rpb24gKCRyb3V0ZVByb3ZpZGVyKSB7XG4gICAgXG4gICAgICAgICRyb3V0ZVByb3ZpZGVyLm90aGVyd2lzZSh7XG4gICAgICAgICAgICByZWRpcmVjdFRvOiAnL3NldHMvbGlzdC9tYW5kb2xpbidcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChcbiAgICAkc2NvcGUsIFxuICAgICRyb290U2NvcGUsIFxuICAgICRsb2NhdGlvbiwgXG4gICAgalBhZ2VTdGF0ZSxcbiAgICBqTW9kYWxzXG4pIHtcbiAgICAkc2NvcGUuY3VycmVudFVybCA9ICRsb2NhdGlvbi5wYXRoKCk7XG4gICAgJHNjb3BlLnBhZ2VTdGF0ZSA9IGpQYWdlU3RhdGUuZ2V0KCk7XG4gICAgJHNjb3BlLmlzQ29sbGFwc2VkID0gdHJ1ZTtcbiAgICBcbiAgICAkcm9vdFNjb3BlLiRvbignbG9jYXRpb25DaGFuZ2VTdGFydCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLmlzQ29sbGFwc2VkID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgICRzY29wZS50b2dnbGVOZXdUdW5lcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHJvb3RTY29wZS5zaG93TmV3VHVuZXMgPSAhJHJvb3RTY29wZS5zaG93TmV3VHVuZXM7XG4gICAgfTtcblxuICAgICRzY29wZS5hZGRUdW5lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBqTW9kYWxzLm9wZW4oJ2FkZFR1bmUnKTtcbiAgICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHJvb3RTY29wZSwgJHJlc291cmNlLCAkaHR0cCkge1xuICAgIHZhciB0YWJsZXMgPSB7fSxcbiAgICAgICAgcmVzb3VyY2VzID0ge30sXG4gICAgICAgIHVwZGF0ZUZyb21UaGVTZXNzaW9uID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkaHR0cCh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICB1cmw6ICcvcmVzdC9zY3JhcGVyJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLm1hcChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJsZXMudHVuZXMucHVzaChuZXcgcmVzb3VyY2VzLnR1bmVzKGl0ZW0pKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCduZXdUdW5lc0ZldGNoZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRSZXNvdXJjZSA9IGZ1bmN0aW9uKHJlc291cmNlTmFtZSwgYXNUYWJsZSkge1xuICAgICAgICAgICAgcmVzb3VyY2VzW3Jlc291cmNlTmFtZV0gPSAkcmVzb3VyY2UoJy9yZXN0LycgKyByZXNvdXJjZU5hbWUgKyAnLzppZCcsIHtcbiAgICAgICAgICAgICAgICBpZDogJ0BfaWQnXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJ2dldCc6IHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgY2FjaGU6IHRydWVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICd1cGRhdGUnOiB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BVVCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gJ3F1ZXJ5JyA6IHsgbWV0aG9kOidHRVQnLCBjYWNoZTogdHJ1ZSwgaXNBcnJheTogdHJ1ZSB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChhc1RhYmxlKSB7XG4gICAgICAgICAgICAgICAgdGFibGVzW3Jlc291cmNlTmFtZV0gPSByZXNvdXJjZXNbcmVzb3VyY2VOYW1lXS5xdWVyeShmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdqRGF0YUxvYWRlZCcsIHJlc291cmNlTmFtZSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2VOYW1lID09PSAndHVuZXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUZyb21UaGVTZXNzaW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0YWJsZXNbcmVzb3VyY2VOYW1lXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlc1tyZXNvdXJjZU5hbWVdO1xuICAgICAgICAgICAgLy8gfSxcblxuICAgICAgICAgICAgLy8gaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vICAgICB2YXIgcmVzb3VyY2VOYW1lcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICAvLyAgICAgZm9yICh2YXIgaSA9IHJlc291cmNlTmFtZXMubGVuZ3RoOyAtLWk7IGk+LTEpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgaWYgKCFyZXNvdXJjZXNbcmVzb3VyY2VOYW1lc1tpXV0pIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIGluaXRSZXNvdXJjZShyZXNvdXJjZU5hbWVzW2ldKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldFRhYmxlOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gdGFibGVzW25hbWVdIHx8IGluaXRSZXNvdXJjZShuYW1lLCAndGFibGUnKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0UmVzb3VyY2U6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNvdXJjZXNbbmFtZV0gfHwgaW5pdFJlc291cmNlKG5hbWUpO1xuICAgICAgICB9IC8vLFxuICAgICAgICAvLyBpbml0OiBpbml0XG5cbiAgICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRyb290U2NvcGUpIHtcbiAgICB2YXIgZHJvcGRvd25zID0ge1xuICAgICAgICBwbGF5YmFjazogW3tcbiAgICAgICAgICAgIHZhbHVlOiAwLFxuICAgICAgICAgICAgbGFiZWw6ICdOb3ZpY2UnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAxLFxuICAgICAgICAgICAgbGFiZWw6ICdIYW5kLWhvbGRpbmcnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAyLFxuICAgICAgICAgICAgbGFiZWw6ICdTbG9wcHkvU2xvdydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6IDMsXG4gICAgICAgICAgICBsYWJlbDogJ1BsYXlhbG9uZydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6IDQsXG4gICAgICAgICAgICBsYWJlbDogJ1N0YXJ0ZXInXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiA1LFxuICAgICAgICAgICAgbGFiZWw6ICdTb2xvJ1xuICAgICAgICB9XSxcbiAgICAgICAgcG9wdWxhcml0eTogW3tcbiAgICAgICAgICAgIHZhbHVlOiAwLFxuICAgICAgICAgICAgbGFiZWw6ICdVbmtub3duJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogMSxcbiAgICAgICAgICAgIGxhYmVsOiAnUmFyZSdcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6IDIsXG4gICAgICAgICAgICBsYWJlbDogJ0NvbW1vbidcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6IDMsXG4gICAgICAgICAgICBsYWJlbDogJ1N0YW5kYXJkJ1xuICAgICAgICB9XSxcbiAgICAgICAgcmF0aW5nOiBbe1xuICAgICAgICAgICAgdmFsdWU6IDEsXG4gICAgICAgICAgICBsYWJlbDogJ01lZGlvY3JlJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogMixcbiAgICAgICAgICAgIGxhYmVsOiAnUnVuIG9mIHRoZSBtaWxsJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogMyxcbiAgICAgICAgICAgIGxhYmVsOiAnUHJldHR5IGdvb2QnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiA0LFxuICAgICAgICAgICAgbGFiZWw6ICdSZWFsbHkgbmljZSdcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6IDUsXG4gICAgICAgICAgICBsYWJlbDogJ1NwZWNpYWwnXG4gICAgICAgIH1dLFxuICAgICAgICBkaWZmaWN1bHR5OiBbe1xuICAgICAgICAgICAgdmFsdWU6IDEsXG4gICAgICAgICAgICBsYWJlbDogJ0Vhc3ktcGVhc3knXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAyLFxuICAgICAgICAgICAgbGFiZWw6ICdTdHJhaWdodGZvcndhcmQnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAzLFxuICAgICAgICAgICAgbGFiZWw6ICdUcmlja3kgQml0cydcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6IDQsXG4gICAgICAgICAgICBsYWJlbDogJ1JlYWxseSBoYXJkJ1xuICAgICAgICB9XSxcbiAgICAgICAgcmh5dGhtOiBbXG4gICAgICAgICAgICAnamlnJyxcbiAgICAgICAgICAgICdyZWVsJyxcbiAgICAgICAgICAgICdzbGlwIGppZycsXG4gICAgICAgICAgICAnaG9ybnBpcGUnLFxuICAgICAgICAgICAgJ3BvbGthJyxcbiAgICAgICAgICAgICdzbGlkZScsXG4gICAgICAgICAgICAnd2FsdHonLFxuICAgICAgICAgICAgJ2Jhcm5kYW5jZScsXG4gICAgICAgICAgICAnc3RyYXRoc3BleScsXG4gICAgICAgICAgICAndGhyZWUtdHdvJyxcbiAgICAgICAgICAgICdtYXp1cmthJ1xuICAgICAgICBdLFxuICAgICAgICByb290OiBbXG4gICAgICAgICAgICAnQScsXG4gICAgICAgICAgICAnQicsXG4gICAgICAgICAgICAnQycsXG4gICAgICAgICAgICAnRCcsXG4gICAgICAgICAgICAnRScsXG4gICAgICAgICAgICAnRicsXG4gICAgICAgICAgICAnRycsXG4gICAgICAgICAgICAnQmInLFxuICAgICAgICAgICAgJ0ViJyxcbiAgICAgICAgICAgICdBYicsXG4gICAgICAgICAgICAnRGInLFxuICAgICAgICAgICAgJ0YjJyxcbiAgICAgICAgICAgICdDIycsXG4gICAgICAgICAgICAnRyMnXG4gICAgICAgIF0sXG4gICAgICAgIG1vZGU6IFtcbiAgICAgICAgICAgICdtYWonLFxuICAgICAgICAgICAgJ21pbicsXG4gICAgICAgICAgICAnbWl4JyxcbiAgICAgICAgICAgICdkb3InLFxuICAgICAgICAgICAgJ2FlbydcbiAgICAgICAgXVxuICAgIH07XG5cbiAgICAkcm9vdFNjb3BlLmRyb3Bkb3ducyA9IGRyb3Bkb3ducztcblxuICAgIHJldHVybiBkcm9wZG93bnM7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpO1xucmVxdWlyZSgnYW5ndWxhci1yZXNvdXJjZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdqbnIuY29tbW9uJywgWyduZ1Jlc291cmNlJ10pXG4gICAgXG4gICAgLmRpcmVjdGl2ZSgnalNlbGVjdE9uQ2xpY2snLCByZXF1aXJlKCcuL3VpL3NlbGVjdC1vbi1jbGljaycpKVxuICAgIC5maWx0ZXIoJ2NhcGl0YWxpc2UnLCByZXF1aXJlKCcuL3VpL2NhcGl0YWxpc2UnKSlcbiAgICAuc2VydmljZSgnak1vZGFscycsIHJlcXVpcmUoJy4vdWkvbW9kYWxzJykpXG4gICAgLnNlcnZpY2UoJ3JlYWRDb29raWUnLCByZXF1aXJlKCcuL3NlcnZpY2VzL3JlYWQtY29va2llJykpXG4gICAgLnNlcnZpY2UoJ2pQYWdlU3RhdGUnLCByZXF1aXJlKCcuL3NlcnZpY2VzL3BhZ2Utc3RhdGUnKSlcbiAgICAuc2VydmljZSgnakRhdGFiYXNlJywgcmVxdWlyZSgnLi9kYXRhL2RhdGFiYXNlJykpXG4gICAgLnNlcnZpY2UoJ2pEcm9wZG93bnMnLCByZXF1aXJlKCcuL2RhdGEvZHJvcGRvd25zJykpXG4gICAgLmNvbnRyb2xsZXIoJ3RvcE5hdicsIHJlcXVpcmUoJy4vY29udHJvbGxlcnMvdG9wLW5hdicpKVxuOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRyb290U2NvcGUsICRjb29raWVzKSB7XG4gICAgdmFyIHBhcmFtcyA9IHt9O1xuICAgICRyb290U2NvcGUucGFnZVN0YXRlID0gcGFyYW1zO1xuICAgIHJldHVybiB7XG4gICAgICAgIHNldDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIC8vIHBhcmFtcyA9IGRhdGE7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gZGF0YSkge1xuICAgICAgICAgICAgICAgIHBhcmFtc1trZXldID0gZGF0YVtrZXldO1xuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICdpbnN0cnVtZW50Jykge1xuICAgICAgICAgICAgICAgICAgICAkY29va2llcy5pbnN0cnVtZW50ID0gZGF0YS5pbnN0cnVtZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAocHJvcCkge1xuICAgICAgICAgICAgcmV0dXJuIHByb3AgPyBwYXJhbXNbcHJvcF0gOiBwYXJhbXM7XG4gICAgICAgIH1cbiAgICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQ6IGNvcGllZCAqLyBcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmVhZENvb2tpZSAobmFtZSkge1xuICAgIHZhciBuYW1lRVEgPSBuYW1lICsgJz0nO1xuICAgIHZhciBjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuICAgIGZvcih2YXIgaT0wO2kgPCBjYS5sZW5ndGg7aSsrKSB7XG4gICAgICAgIHZhciBjID0gY2FbaV07XG4gICAgICAgIHdoaWxlIChjLmNoYXJBdCgwKSA9PT0gJyAnKSB7XG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogY29waWVkICovIFxuICAgICAgICAgICAgYyA9IGMuc3Vic3RyaW5nKDEsYy5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZjogY29waWVkICovIFxuICAgICAgICBpZiAoYy5pbmRleE9mKG5hbWVFUSkgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBjLnN1YnN0cmluZyhuYW1lRVEubGVuZ3RoLGMubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICByZXR1cm4gaW5wdXQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBpbnB1dC5zdWJzdHIoMSk7XG4gICAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRtb2RhbCkge1xuICAgIFxuICAgIHZhciBjb25maWdzID0ge1xuICAgICAgICB0dW5lVmlld2VyOiB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zcmMvdHVuZS90cGwvdHVuZS12aWV3ZXIuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAndHVuZVZpZXdlcicsXG4gICAgICAgICAgICB3aW5kb3dDbGFzczogICd0dW5lLXZpZXdlciBmYWRlJ1xuICAgICAgICB9LFxuICAgICAgICBhZGRUdW5lOiB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zcmMvdHVuZS90cGwvYWRkLXR1bmUuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnYWRkVHVuZScsXG4gICAgICAgICAgICB3aW5kb3dDbGFzczogICdhZGQtdHVuZSBmYWRlJ1xuICAgICAgICB9LFxuICAgICAgICBwZXJmb3JtYW5jZUVkaXRvcjoge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvc3JjL3R1bmUvdHBsL3BlcmZvcm1hbmNlLWVkaXRvci5odG1sJyxcbiAgICAgICAgICAgIHdpbmRvd0NsYXNzOiAgJ2ZhZGUnXG4gICAgICAgIH0sXG4gICAgICAgIGFycmFuZ2VtZW50Q29uZmlybToge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvc3JjL3R1bmUvdHBsL2FycmFuZ2VtZW50LWNvbmZpcm0uaHRtbCcsXG4gICAgICAgICAgICB3aW5kb3dDbGFzczogICdmYWRlJ1xuICAgICAgICB9LFxuICAgICAgICBhYmNDb25maXJtOiB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zcmMvdHVuZS90cGwvYWJjLWNvbmZpcm0uaHRtbCcsXG4gICAgICAgICAgICB3aW5kb3dDbGFzczogICdmYWRlJ1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIG9wZW46IGZ1bmN0aW9uICh0eXBlLCBzY29wZSkge1xuICAgICAgICAgICAgdmFyIGNvbmYgPSBjb25maWdzW3R5cGVdIHx8IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBwYXJhbm9pZCBmYWxsYmFjayAqLyB7fTtcbiAgICAgICAgICAgIHNjb3BlICYmIChjb25mLnNjb3BlID0gc2NvcGUpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gJG1vZGFsLm9wZW4oY29uZik7XG5cbiAgICAgICAgfVxuICAgIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgZWxlbWVudC5iaW5kKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGVsZW1lbnRbMF0uc2VsZWN0KCk7XG4gICAgICAgIH0pO1xuICAgIH07XG59O1xuIiwiLy8gdmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyksXG4vLyAgICAgbGlzdFR1bmVzID0gcmVxdWlyZSgnc3JjL3R1bmUtbGlzdHMvY29udHJvbGxlcnMvbGlzdC10dW5lcycpLFxuLy8gICAgIC8vIHZpZXdUdW5lID0gcmVxdWlyZSgnc3JjL2NvbnRyb2xsZXJzL3ZpZXctdHVuZScpLFxuLy8gICAgIC8vIHNldEJ1aWxkZXIgPSByZXF1aXJlKCdzcmMvY29udHJvbGxlcnMvc2V0LWJ1aWxkZXInKSxcbi8vICAgICAvLyBsaXN0U2V0cyA9IHJlcXVpcmUoJ3NyYy9jb250cm9sbGVycy9saXN0LXNldHMnKSxcbi8vICAgICBuZXdUdW5lcyA9IHJlcXVpcmUoJ3NyYy90dW5lLWxpc3RzL2NvbnRyb2xsZXJzL25ldy10dW5lcycpLFxuLy8gICAgIHR1bmVWaWV3ZXIgPSByZXF1aXJlKCdzcmMvY29udHJvbGxlcnMvbW9kYWxzL3R1bmUtdmlld2VyJyksXG4vLyAgICAgYWRkVHVuZSA9IHJlcXVpcmUoJ3NyYy9jb250cm9sbGVycy9tb2RhbHMvYWRkLXR1bmUnKSxcbi8vICAgICB0b3BOYXYgPSByZXF1aXJlKCdzcmMvY29udHJvbGxlcnMvaW5jbHVkZS90b3AtbmF2Jyk7XG5cblxuLy8gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cbi8vICAgICBhbmd1bGFyLm1vZHVsZSgnam5yJylcbi8vICAgICAgICAgLmNvbnRyb2xsZXIoJ2xpc3RUdW5lcycsIGxpc3RUdW5lcylcbi8vICAgICAgICAgLy8uY29udHJvbGxlcigndmlld1R1bmUnLCB2aWV3VHVuZSlcbi8vICAgICAgICAgLy8uY29udHJvbGxlcignc2V0QnVpbGRlcicsIHNldEJ1aWxkZXIpXG4vLyAgICAgICAgIC8vLmNvbnRyb2xsZXIoJ2xpc3RTZXRzJywgbGlzdFNldHMpXG4vLyAgICAgICAgIC5jb250cm9sbGVyKCduZXdUdW5lcycsIG5ld1R1bmVzKVxuLy8gICAgICAgICAuY29udHJvbGxlcigndHVuZVZpZXdlcicsIHR1bmVWaWV3ZXIpXG4vLyAgICAgICAgIC5jb250cm9sbGVyKCdhZGRUdW5lJywgYWRkVHVuZSlcbi8vICAgICAgICAgLmNvbnRyb2xsZXIoJ3RvcE5hdicsIHRvcE5hdik7XG5cbi8vIH07XG4iLCJ2YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKTtcbnJlcXVpcmUoJ3NyYy9hcHAnKTtcblxuYW5ndWxhci5ib290c3RyYXAoZG9jdW1lbnQsIFsnam5yJ10pOyIsIi8vICd1c2Ugc3RyaWN0JztcblxuLy8gdmFyIHJlYWRDb29raWUgPSByZXF1aXJlKCdzcmMvY29tbW9uL3JlYWQtY29va2llJyk7XG5cbi8vIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXG4vLyAgICAgcmVxdWlyZSgnYW5ndWxhcicpLm1vZHVsZSgnam5yJykuY29uZmlnKFsnJHJvdXRlUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInLCBmdW5jdGlvbiAoJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG4gICAgICAgIFxuLy8gICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSkuaGFzaFByZWZpeCgnIScpOyAgIFxuXG4vLyAgICAgICAgICRyb3V0ZVByb3ZpZGVyLndoZW4oJy90dW5lcycsIHtcbi8vICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL2xpc3QtdHVuZXMuaHRtbCdcbi8vICAgICAgICAgfSkud2hlbignL3R1bmVzLzppbnN0cnVtZW50Jywge1xuLy8gICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvdmlld3MvbGlzdC10dW5lcy5odG1sJ1xuLy8gICAgICAgICAvLyB9KS53aGVuKCcvdHVuZS86aWQnLCB7XG4vLyAgICAgICAgIC8vICAgICB0ZW1wbGF0ZVVybDogJy92aWV3cy90dW5lLmh0bWwnXG4vLyAgICAgICAgIC8vIH0pLndoZW4oJy90dW5lLzppZC86aW5zdHJ1bWVudCcsIHtcbi8vICAgICAgICAgLy8gICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL3R1bmUuaHRtbCdcbi8vICAgICAgICAgLy8gfSkud2hlbignL3NldHMvbmV3LycsIHtcbi8vICAgICAgICAgLy8gICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL3NldC1idWlsZGVyLmh0bWwnXG4vLyAgICAgICAgIC8vIH0pLndoZW4oJy9zZXRzL2xpc3QvJywge1xuLy8gICAgICAgICAvLyAgICAgdGVtcGxhdGVVcmw6ICcvdmlld3Mvc2V0LWxpc3QuaHRtbCdcbi8vICAgICAgICAgLy8gfSkud2hlbignL3NldHMvbmV3LzppbnN0cnVtZW50Jywge1xuLy8gICAgICAgICAvLyAgICAgdGVtcGxhdGVVcmw6ICcvdmlld3Mvc2V0LWJ1aWxkZXIuaHRtbCdcbi8vICAgICAgICAgLy8gfSkud2hlbignL3NldHMvbGlzdC86aW5zdHJ1bWVudCcsIHtcbi8vICAgICAgICAgLy8gICAgIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL3NldC1saXN0Lmh0bWwnXG4vLyAgICAgICAgIH0pLm90aGVyd2lzZSh7XG4vLyAgICAgICAgICAgICByZWRpcmVjdFRvOiAnL3R1bmVzLycgKyAoIHJlYWRDb29raWUoJ2luc3RydW1lbnQnKSB8fCAnbWFuZG9saW4nKVxuLy8gICAgICAgICB9KTtcbi8vICAgICB9XSk7XG4vLyB9O1xuXG4gICAgXG4iLCIvLyAndXNlIHN0cmljdCc7XG5cbi8vIHJlcXVpcmUoJ3NyYy9zZXJ2aWNlcy9wYWdlLXN0YXRlJyk7XG5cbi8vIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFxuLy8gICAgICRzY29wZSwgICAgIFxuLy8gICAgICRyb3V0ZVBhcmFtcywgXG4vLyAgICAgalBhZ2VTdGF0ZVxuLy8gKSB7XG4vLyAgICAgalBhZ2VTdGF0ZS5zZXQoe1xuLy8gICAgICAgICBzZWN0aW9uOiAnc2V0cycsXG4vLyAgICAgICAgIGluc3RydW1lbnQ6ICRyb3V0ZVBhcmFtcy5pbnN0cnVtZW50LFxuLy8gICAgICAgICBzdWJzZWN0aW9uOiAnbmV3JywgXG4vLyAgICAgICAgIHBhdGg6ICcvc2V0cy9uZXcnXG4vLyAgICAgfSk7XG4vLyB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCdzcmMvc2V0L3NlcnZpY2VzL3NldC1tb2RlbCcpO1xucmVxdWlyZSgnc3JjL2NvbW1vbi9zZXJ2aWNlcy9wYWdlLXN0YXRlJyk7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFxuICAgICRyb3V0ZVBhcmFtcywgXG4gICAgJHNjb3BlLCBcbiAgICAkcm9vdFNjb3BlLFxuICAgIGpNb2RhbHMsXG4gICAgalNldCxcbiAgICAkdGltZW91dCxcbiAgICBqUGFnZVN0YXRlLFxuICAgIGpEYXRhYmFzZVxuKSB7XG5cbiAgICAvLyBjb25zb2xlLmxvZyhqRGF0YWJhc2UuZ2V0VGFibGUoJ3R1bmVzJyksICdyZWQnKTtcbiAgICBqUGFnZVN0YXRlLnNldCh7XG4gICAgICAgIHNlY3Rpb246ICdzZXRzJyxcbiAgICAgICAgaW5zdHJ1bWVudDogJHJvdXRlUGFyYW1zLmluc3RydW1lbnQsXG4gICAgICAgIHN1YnNlY3Rpb246ICdsaXN0JywgXG4gICAgICAgIHBhdGg6ICcvc2V0cy9saXN0J1xuICAgIH0pO1xuICAgIFxuICAgICRzY29wZS5zZWxlY3RlZFR1bmVzID0gW107XG5cbiAgICAkc2NvcGUuYXJyYW5nZW1lbnRzID0gW107XG4gICAgakRhdGFiYXNlLmdldFRhYmxlKCd0dW5lcycpLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKGRhdGEpe1xuICAgICAgICAkc2NvcGUuYXJyYW5nZW1lbnRzID0gXy5zb3J0QnkoZGF0YS5tYXAoZnVuY3Rpb24gKHR1bmUpIHtcbiAgICAgICAgICAgIHZhciBwZXJmID0gXy5maW5kV2hlcmUodHVuZS5wZXJmb3JtYW5jZXMsIHtpbnN0cnVtZW50OiAkcm91dGVQYXJhbXMuaW5zdHJ1bWVudH0pO1xuICAgICAgICAgICAgaWYgKHBlcmYpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJyID0gXy5maW5kV2hlcmUodHVuZS5hcnJhbmdlbWVudHMsIHtfaWQ6IHBlcmYuYXJyYW5nZW1lbnR9KTtcbiAgICAgICAgICAgICAgICBhcnIubmFtZSA9IHR1bmUubmFtZSArICcgJyArIGFyci5yb290ICsgdHVuZS5tb2RlICsgJyAnICsgdHVuZS5yaHl0aG07XG4gICAgICAgICAgICAgICAgYXJyLnNhbml0aXNlZE5hbWUgPSBhcnIubmFtZS5yZXBsYWNlKC9eKFRoZXxBKSAvLCAnJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgfSksICdzYW5pdGlzZWROYW1lJyk7ICBcbiAgICB9KTtcblxuICAgICRzY29wZS5zZXRzID0gW107XG4gICAgakRhdGFiYXNlLmdldFRhYmxlKCd0dW5lcycpLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICBqRGF0YWJhc2UuZ2V0VGFibGUoJ3NldHMnKS4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAkc2NvcGUuc2V0cyA9IGRhdGEubWFwKGZ1bmN0aW9uIChzZXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGpTZXQoc2V0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnNldHMgPSBfLnNvcnRCeSgkc2NvcGUuc2V0cywgZnVuY3Rpb24gKHNldCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2V0LnBlcmZvcm1hbmNlLmxhc3RQcmFjdGljZWQgLSAoc2V0LnBlcmZvcm1hbmNlLnN0YW5kYXJkICogMTIgKiA2MCAqMjQwMDApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgXG4gICAgICAgIC8vICRzY29wZS5zZXRzID0gJHNjb3BlLnNldHMuc29ydChmdW5jdGlvbiAoc2V0MSwgc2V0Mikge1xuICAgICAgICAvLyAgICAgcmV0dXJuIHNldDIucGVyZm9ybWFuY2UubGFzdFByYWN0aWNlZCAtIHNldDEucGVyZm9ybWFuY2UubGFzdFByYWN0aWNlZDtcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIFxuICAgIH0pO1xuICAgICAgICBcblxuICAgICRzY29wZS51bmRvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRUdW5lcy5wb3AoKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNlbGVjdFR1bmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZFR1bmVzLnB1c2godGhpcy5zZWxlY3RlZFR1bmUpO1xuICAgICAgICB0aGlzLnNlbGVjdGVkVHVuZSA9IG51bGw7XG4gICAgfTtcblxuICAgICRzY29wZS5zZWxlY3RlZEluZGV4ID0gLTE7XG5cbiAgICAkc2NvcGUuZXhwYW5kUm93ID0gZnVuY3Rpb24gKCRpbmRleCkge1xuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRJbmRleCA9ICRpbmRleDtcbiAgICB9O1xuXG5cbiAgICAkc2NvcGUuc2F2ZVNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHR1bmVzID0gJHNjb3BlLnNlbGVjdGVkVHVuZXM7XG4gICAgICAgIGlmICh0dW5lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGpEYXRhYmFzZS5nZXRSZXNvdXJjZSgnc2V0cycpLnNhdmUoe1xuICAgICAgICAgICAgICAgIG5hbWU6ICdmdXp6eScgKyBNYXRoLnJhbmRvbSgpLFxuICAgICAgICAgICAgICAgIHR1bmVzOiB0dW5lc1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHNldCkge1xuICAgICAgICAgICAgICAgIGpEYXRhYmFzZS5nZXRUYWJsZSgnc2V0cycpLnNoaWZ0KHNldCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZFR1bmVzID0gW107XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLnByYWN0aWNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnR1bmUudXBkYXRlKCk7XG4gICAgICAgIHZhciBzZXQgPSB0aGlzLiRwYXJlbnQuJHBhcmVudC5zZXQ7XG4gICAgICAgIHZhciB0dW5lc0xlZnRUb1ByYWN0aWNlID0gc2V0LnR1bmVzLmZpbHRlcihmdW5jdGlvbiAodHVuZSkge1xuICAgICAgICAgICAgcmV0dXJuIChuZXcgRGF0ZSgpKSAtIChuZXcgRGF0ZSh0dW5lLnBlcmZvcm1hbmNlLmxhc3RQcmFjdGljZWQpKSA+IDEyMDAwMDtcbiAgICAgICAgfSkubGVuZ3RoO1xuXG4gICAgICAgIGlmICghdHVuZXNMZWZ0VG9QcmFjdGljZSkge1xuICAgICAgICAgICAgJHNjb3BlLnNldHMuc3BsaWNlKCRzY29wZS5zZXRzLmluZGV4T2Yoc2V0KSwgMSk7XG4gICAgICAgICAgICAkc2NvcGUuc2V0cy5wdXNoKHNldCk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICAkc2NvcGUuZXhwYW5kVHVuZSA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuICAgICAgICAkcm9vdFNjb3BlLmFjdGl2ZVR1bmUgPSB0aGlzLnR1bmU7XG4gICAgICAgIHRoaXMucHJvcGVydGllc0NvbGxhcHNlZCA9ICFvcHRzLmVkaXQ7XG4gICAgICAgIHRoaXMuc2hvd1BlcmZvcm1hbmNlID0gIW9wdHMubm9QZXJmb3JtYW5jZTtcbiAgICAgICAgak1vZGFscy5vcGVuKCd0dW5lVmlld2VyJywgdGhpcyk7XG4gICAgfTtcblxuICAgICRzY29wZS5wcmFjdGljZUFsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNldCA9IHRoaXMucmF0ZWU7XG4gICAgICAgIHNldC50dW5lcy5mb3JFYWNoKGZ1bmN0aW9uICh0dW5lKSB7XG4gICAgICAgICAgICB0dW5lLmR1bW15U3RhbmRhcmQgPSBzZXQuZHVtbXlTdGFuZGFyZDtcbiAgICAgICAgICAgIHR1bmUudXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBzZXQudXBkYXRlUGVyZm9ybWFuY2UodHJ1ZSk7XG5cbiAgICAgICAgJHNjb3BlLnNldHMuc3BsaWNlKCRzY29wZS5zZXRzLmluZGV4T2Yoc2V0KSwgMSk7XG4gICAgICAgICRzY29wZS5zZXRzLnB1c2goc2V0KTtcbiAgICB9O1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJ3NyYy9jb21tb24vbW9kdWxlJyk7XG5yZXF1aXJlKCdzcmMvc2V0L21vZHVsZScpO1xuXG52YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKSxcbiAgICByZWFkQ29va2llID0gcmVxdWlyZSgnc3JjL2NvbW1vbi9zZXJ2aWNlcy9yZWFkLWNvb2tpZScpLFxuICAgIHNldE1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdqbnIuc2V0LWxpc3RzJywgWydqbnIuY29tbW9uJywgJ2puci5zZXQnXSksXG4gICAgbGlzdFNldHMgPSByZXF1aXJlKCdzcmMvc2V0LWxpc3RzL2NvbnRyb2xsZXJzL2xpc3Qtc2V0cycpO1xuICAgIC8vIGFkZFR1bmUgPSByZXF1aXJlKCdzcmMvc2V0L2NvbnRyb2xsZXJzL2FkZC1zZXQnKTtcbiAgICAgICAgXG5cbm1vZHVsZS5leHBvcnRzID0gc2V0TW9kdWxlXG4gICAgLmNvbnRyb2xsZXIoJ2xpc3RTZXRzJywgbGlzdFNldHMpXG4gICAgLmNvbmZpZyhmdW5jdGlvbiAoJHJvdXRlUHJvdmlkZXIpIHtcbiAgICBcbiAgICAgICAgJHJvdXRlUHJvdmlkZXIud2hlbignL3NldHMvbGlzdC8nLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zcmMvc2V0LWxpc3RzL3RwbC9saXN0LXNldHMuaHRtbCdcbiAgICAgICAgfSkud2hlbignL3NldHMvbGlzdC86aW5zdHJ1bWVudCcsIHtcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3NyYy9zZXQtbGlzdHMvdHBsL2xpc3Qtc2V0cy5odG1sJ1xuICAgICAgICB9KTtcbiAgICB9KTsiLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJ3NyYy9jb21tb24vbW9kdWxlJyk7XG5yZXF1aXJlKCdzcmMvdHVuZS9tb2R1bGUnKTtcblxudmFyIGFuZ3VsYXIgPSByZXF1aXJlKCdhbmd1bGFyJyksXG4gICAgc2V0TW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2puci5zZXQnLCBbJ2puci5jb21tb24nLCAnam5yLnR1bmUnXSk7XG4gICAgLy8gc2V0Vmlld2VyID0gcmVxdWlyZSgnc3JjL3NldC9jb250cm9sbGVycy9zZXQtdmlld2VyJyksXG4gICAgLy8gYWRkVHVuZSA9IHJlcXVpcmUoJ3NyYy9zZXQvY29udHJvbGxlcnMvYWRkLXNldCcpO1xuICAgICAgICBcblxubW9kdWxlLmV4cG9ydHMgPSBzZXRNb2R1bGU7XG4gICAgLy8gLmNvbnRyb2xsZXIoJ3NldFZpZXdlcicsIHNldFZpZXdlcilcbiAgICAvLyAuY29udHJvbGxlcignYWRkVHVuZScsIGFkZFR1bmUpOyIsInZhciBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpLFxuICAgIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxuLy8gcmVxdWlyZSgnc3JjL3R1bmUvc2VydmljZXMvYWJjLXBhcnNlcicpO1xuXG5yZXF1aXJlKCdhbmd1bGFyJykubW9kdWxlKCdqbnIuc2V0JykuZmFjdG9yeSgnalNldCcsIGZ1bmN0aW9uIChcbiAgICAkcm91dGVQYXJhbXMsXG4gICAgJHJvb3RTY29wZSxcbiAgICBqRGF0YWJhc2UsXG4gICAgalR1bmVcbikge1xuXG4gICAgdmFyIHR1bmVzRmV0Y2hlZCA9IGZhbHNlO1xuICAgICAgICBcbiAgICB2YXIgU2V0ID0gZnVuY3Rpb24gKHNldCwgb3B0cykge1xuICAgICAgICB0aGlzLnNldCA9IHNldDtcbiAgICAgICAgdGhpcy5vcHRzID0gb3B0cyB8fCB7fTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIFNldC5wcm90b3R5cGUgPSB7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMub3ZlcmZsb3cgPSA2IC0gdGhpcy5zZXQudHVuZXMubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKCF0dW5lc0ZldGNoZWQpIHtcbiAgICAgICAgICAgICAgICBqRGF0YWJhc2UuZ2V0VGFibGUoJ3R1bmVzJykuJHByb21pc2UudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHR1bmVzRmV0Y2hlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VHVuZXMoKTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIHRoaXMucGVyZm9ybWFuY2UgPSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YW5kYXJkOiAtMSxcbiAgICAgICAgICAgICAgICAgICAgYmVzdDogLTEsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RQcmFjdGljZWQ6IDBcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFR1bmVzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHNldFR1bmVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zZXQudHVuZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnR1bmVzID0gdGhpcy5zZXQudHVuZXMubWFwKGZ1bmN0aW9uIChhcnJhbmdlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4galR1bmUuZ2V0Rm9yQXJyYW5nZW1lbnQoYXJyYW5nZW1lbnQsICRyb290U2NvcGUucGFnZVN0YXRlLmluc3RydW1lbnQpOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9KTsgICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVBlcmZvcm1hbmNlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudHVuZXMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICB9LFxuICAgICAgICB1cGRhdGVQZXJmb3JtYW5jZTogZnVuY3Rpb24gKHByYWN0aWNlZCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmR1bW15U3RhbmRhcmQgPSAtMTtcbiAgICAgICAgICAgIHRoaXMucGVyZm9ybWFuY2UgPSB7XG4gICAgICAgICAgICAgICAgc3RhbmRhcmQ6IHRoaXMudHVuZXMucmVkdWNlKGZ1bmN0aW9uIChwcmV2VmFsLCB0dW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLm1pbihwcmV2VmFsLCB0dW5lLnBlcmZvcm1hbmNlLnN0YW5kYXJkKTtcbiAgICAgICAgICAgICAgICB9LCA1KSxcbiAgICAgICAgICAgICAgICBiZXN0OiB0aGlzLnR1bmVzLnJlZHVjZShmdW5jdGlvbiAocHJldlZhbCwgdHVuZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5taW4ocHJldlZhbCwgdHVuZS5wZXJmb3JtYW5jZS5iZXN0KTtcbiAgICAgICAgICAgICAgICB9LCA1KSxcbiAgICAgICAgICAgICAgICBsYXN0UHJhY3RpY2VkOiAvL3ByYWN0aWNlZCA/IERhdGUubm93KCkgOiBcbiAgICAgICAgICAgICAgICB0aGlzLnR1bmVzLnJlZHVjZShmdW5jdGlvbiAocHJldlZhbCwgdHVuZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHByZXZWYWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKG5ldyBEYXRlKHR1bmUucGVyZm9ybWFuY2UubGFzdFByYWN0aWNlZCkuZ2V0VGltZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5taW4ocHJldlZhbCwgKG5ldyBEYXRlKHR1bmUucGVyZm9ybWFuY2UubGFzdFByYWN0aWNlZCkpLmdldFRpbWUoKSk7XG4gICAgICAgICAgICAgICAgfSwgdW5kZWZpbmVkKVxuICAgICAgICAgICAgfTsgXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICByZXR1cm4gU2V0O1xuICAgICAgIFxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBsaXF1aWRNZXRhbCA9IHJlcXVpcmUoJ2xpcXVpZG1ldGFsJyksXG4gICAgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG5yZXF1aXJlKCdzcmMvdHVuZS1saXN0cy9zZXJ2aWNlcy90dW5lLWxpc3QnKTtcbnJlcXVpcmUoJ3NyYy90dW5lL3VpL3R1bmUtaGVhZGluZycpO1xucmVxdWlyZSgnc3JjL3R1bmUvdWkvcGVyZm9ybWFuY2UtcmF0ZXInKTtcbnJlcXVpcmUoJ3NyYy9jb21tb24vdWkvc2VsZWN0LW9uLWNsaWNrJyk7XG5yZXF1aXJlKCdzcmMvY29tbW9uL3NlcnZpY2VzL3BhZ2Utc3RhdGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoXG4gICAgJHNjb3BlLCBcbiAgICAkcm9vdFNjb3BlLCBcbiAgICAkcm91dGVQYXJhbXMsIFxuICAgIGpQYWdlU3RhdGUsIFxuICAgIGpUdW5lTGlzdFxuKSB7XG4gICAgdmFyIGZpbHRlcnMgPSB7XG4gICAgICAgICAgICBwcmFjdGljZTogZnVuY3Rpb24gKHR1bmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHVuZS50dW5lLnBlcmZvcm1hbmNlcy5sZW5ndGggJiYgKCEkcm91dGVQYXJhbXMuaW5zdHJ1bWVudCB8fCBfLmZpbHRlcih0dW5lLnR1bmUucGVyZm9ybWFuY2VzLCBmdW5jdGlvbiAocGVyZm9ybWFuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBlcmZvcm1hbmNlLmluc3RydW1lbnQgPT09ICRyb3V0ZVBhcmFtcy5pbnN0cnVtZW50ICYmIChwZXJmb3JtYW5jZS5iZXN0ID4gMiB8fCBwZXJmb3JtYW5jZS5zcGVjaWFsKTtcbiAgICAgICAgICAgICAgICB9KS5sZW5ndGgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNlYXJjaDogZnVuY3Rpb24gKHR1bmUpIHtcbiAgICAgICAgICAgICAgICB0dW5lLnNlYXJjaFNjb3JlID0gbGlxdWlkTWV0YWwuc2NvcmUodHVuZS50dW5lLm5hbWUsICRzY29wZS5zZWFyY2hUZXJtLnJlcGxhY2UoL1xccy9nLCAnJykpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0dW5lLnNlYXJjaFNjb3JlID4gMC4zO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzb3J0ZXJzID0ge1xuICAgICAgICAgICAgcHJhY3RpY2U6IGZ1bmN0aW9uICh0dW5lKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBlcmZvcm1hbmNlID0gdHVuZS5wZXJmb3JtYW5jZSB8fCB0dW5lLl9jcmVhdGVQZXJmb3JtYW5jZSgpLFxuICAgICAgICAgICAgICAgICAgICBnYXAgPSBwZXJmb3JtYW5jZS5iZXN0IC0gcGVyZm9ybWFuY2Uuc3RhbmRhcmQsXG4gICAgICAgICAgICAgICAgICAgIGRpZmZpY3VsdHkgPSBwZXJmb3JtYW5jZS5kaWZmaWN1bHR5ID09PSAtMSA/IDAgOiBwZXJmb3JtYW5jZS5kaWZmaWN1bHR5LFxuICAgICAgICAgICAgICAgICAgICByYXRpbmcgPSB0dW5lLnR1bmUucmF0aW5nID09PSAtMSA/IDAgOiB0dW5lLnR1bmUucmF0aW5nLFxuICAgICAgICAgICAgICAgICAgICBwb3B1bGFyaXR5ID0gdHVuZS50dW5lLnBvcHVsYXJpdHkgPT09IC0xID8gMCA6IHR1bmUudHVuZS5wb3B1bGFyaXR5LFxuICAgICAgICAgICAgICAgICAgICBwcmFjdGljZVVyZ2VuY3kgPSAwLFxuICAgICAgICAgICAgICAgICAgICB1bmlxdWVWZXJzaW9uID0gdHVuZS50dW5lLnBlcmZvcm1hbmNlcy5sZW5ndGggPCAyLFxuICAgICAgICAgICAgICAgICAgICB0dW5lUmFuayA9IChwZXJmb3JtYW5jZS5zcGVjaWFsICogNSkgKyAoMS41ICogcmF0aW5nKSArIHBvcHVsYXJpdHkgKyB1bmlxdWVWZXJzaW9uO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBlcmZvcm1hbmNlLmJlc3QgPiAyIHx8IHBlcmZvcm1hbmNlLnNwZWNpYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJhY3RpY2VVcmdlbmN5ID0gKGdhcCArIChkaWZmaWN1bHR5IC8gMikgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBlcmZvcm1hbmNlLnN0YW5kYXJkIDwgMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJhY3RpY2VVcmdlbmN5ICs9IGdhcDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAocGVyZm9ybWFuY2Uuc3BlY2lhbCAmJiBwZXJmb3JtYW5jZS5iZXN0IDwgMyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByYWN0aWNlVXJnZW5jeSArPSAyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJhY3RpY2VVcmdlbmN5ID0gKGdhcCAtIChkaWZmaWN1bHR5IC8gMikgKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHVuZS5wcmFjdGljZVJhbmsgPSB0dW5lUmFuayAqIHByYWN0aWNlVXJnZW5jeSAqICh0dW5lLmRheXNTaW5jZUxhc3RQcmFjdGljZSArIDEpO1xuICAgICAgICAgICAgICAgIHJldHVybiAtdHVuZS5wcmFjdGljZVJhbms7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2VhcmNoOiBmdW5jdGlvbiAodHVuZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAtdHVuZS5zZWFyY2hTY29yZTsgXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGdldEZpbHRlciA9IGZ1bmN0aW9uIChmaWx0ZXJUZXJtKSB7XG4gICAgICAgICAgICB2YXIgbW9kZVRlcm0gPSAkc2NvcGUuZmlsdGVyTW9kZS50cmltKCksXG4gICAgICAgICAgICAgICAgcmh5dGhtVGVybSA9ICRzY29wZS5maWx0ZXJSaHl0aG0udHJpbSgpO1xuXG4gICAgICAgICAgICB2YXIgYWxsVHVuZVJoeXRobXMgPSAkcm9vdFNjb3BlLmRyb3Bkb3ducy5yaHl0aG0sXG4gICAgICAgICAgICAgICAgcmh5dGhtcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgaW5jbHVkZWQ6IFtdLFxuICAgICAgICAgICAgICAgICAgICBleGNsdWRlZDogW11cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAocmh5dGhtVGVybSkge1xuICAgICAgICAgICAgICAgIHJoeXRobVRlcm0gPSByaHl0aG1UZXJtLnNwbGl0KCd8Jyk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGFsbFR1bmVSaHl0aG1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyaHl0aG1UZXJtLmluZGV4T2YoYWxsVHVuZVJoeXRobXNba2V5XSkgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmh5dGhtcy5pbmNsdWRlZC5wdXNoKGFsbFR1bmVSaHl0aG1zW2tleV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChyaHl0aG1UZXJtLmluZGV4T2YoJyEnICsgYWxsVHVuZVJoeXRobXNba2V5XSkgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmh5dGhtcy5leGNsdWRlZC5wdXNoKGFsbFR1bmVSaHl0aG1zW2tleV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobW9kZVRlcm0gJiYgL14oXFwhPyhbQUJDREVGR10oI3xiKT8pPyhbYS16XXszfSk/KFxcfCk/KSskLy50ZXN0KG1vZGVUZXJtKSkge1xuICAgICAgICAgICAgICAgIHZhciBtb2RlcyA9IFtdLFxuICAgICAgICAgICAgICAgICAgICBtb2RlLFxuICAgICAgICAgICAgICAgICAgICBtb2RlTWF0Y2hlcnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmQ6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3I6IFtdXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgLy8gbW9kZVRlcm0gPSBtb2RlVGVybS5yZXBsYWNlKC9cXChbXihdK1xcKS9nLCBmdW5jdGlvbiAoJDEpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgbW9kZXMucHVzaCgkMS5zdWJzdHIoMSwgJDEubGVuZ3RoIC0gMikpO1xuICAgICAgICAgICAgICAgIC8vICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICAgICAgLy8gfSk7XG5cbiAgICAgICAgICAgICAgICBtb2RlcyA9IG1vZGVzLmNvbmNhdChtb2RlVGVybSk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKG1vZGUgaW4gbW9kZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0U2luZ2xlTW9kZUZpbHRlcihtb2Rlc1ttb2RlXSwgbW9kZU1hdGNoZXJzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZmlsdGVyIGJ5IGUuZyBHfGFlbyBEbWFqLCBtaXh8bWFqLiBjYXNlIHNlbnNpdGl2ZSwgIUcgKG5vdCBhdXRvbWF0aWNhbGx5IGJlY29tZXMgYW4gYW5kKVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAodHVuZSkge1xuICAgICAgICAgICAgICAgIGlmIChyaHl0aG1UZXJtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgocmh5dGhtcy5pbmNsdWRlZC5sZW5ndGggJiYgcmh5dGhtcy5pbmNsdWRlZC5pbmRleE9mKHR1bmUudHVuZS5yaHl0aG0pID09PSAtMSkgfHwgKHJoeXRobXMuZXhjbHVkZWQubGVuZ3RoICYmIHJoeXRobXMuZXhjbHVkZWQuaW5kZXhPZih0dW5lLnR1bmUucmh5dGhtKSA+IC0xKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobW9kZU1hdGNoZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBydW5NYXRjaGVycyh0dW5lLCBtb2RlTWF0Y2hlcnMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICB9LFxuXG4gICAgICAgIGdldFNpbmdsZU1vZGVGaWx0ZXIgPSBmdW5jdGlvbiAobW9kZSwgbWF0Y2hlcnMpIHtcbiAgICAgICAgICAgIC8vIGlmICghbW9kZSkge1xuICAgICAgICAgICAgLy8gICAgIHJldHVybjtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIHZhciBzdGF0ZW1lbnRzO1xuICAgICAgICAgICAgLy8gaWYgKG1vZGUuaW5kZXhPZignfCEnKSA+IC0xKSB7XG4gICAgICAgICAgICAvLyAgICAgc3RhdGVtZW50cyA9IG1vZGUuc3BsaXQoJ3whJyk7XG4gICAgICAgICAgICAvLyAgICAgc3RhdGVtZW50cy5tYXAoZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgICAvLyAgICAgICAgIGdldFNpbmdsZU1vZGVGaWx0ZXIoaW5kZXggIT09IDAgPyAnIScgOiAnJyArIGl0ZW0sIG1hdGNoZXJzKTtcbiAgICAgICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgICAgIC8vICAgICByZXR1cm47XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBpZiAoL1thLXpdXFx8W0EtWl0vLnRlc3QobW9kZSkpIHtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGVtZW50cyA9IG1vZGUuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGksIFxuICAgICAgICAgICAgICAgICAgICAgICAgaWwsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgPSAnJztcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBpbCA9IHN0YXRlbWVudHMubGVuZ3RoOyBpPGlsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc3RhdGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50ID0gc3RhdGVtZW50c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2U6IG90aGVyIGNvZGUgcHJldmVudHMgaXQgZXZlciBydW5uaW5nICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC9bYS16XS8udGVzdChzdGF0ZW1lbnQuY2hhckF0KHN0YXRlbWVudC5sZW5ndGggLSAxKSkgJiYgL1tBLVpdLy50ZXN0KHN0YXRlbWVudHNbaV0uY2hhckF0KDApKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRTaW5nbGVNb2RlRmlsdGVyKHN0YXRlbWVudCwgbWF0Y2hlcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgPSBzdGF0ZW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9ICAgXG4gICAgICAgICAgICAgICAgICAgIGdldFNpbmdsZU1vZGVGaWx0ZXIoc3RhdGVtZW50LCBtYXRjaGVycyk7XG5cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSgpKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcm9vdHMgPSBtb2RlLm1hdGNoKC9bQS1aXS9nKSxcbiAgICAgICAgICAgICAgICBtb2RlcyA9IG1vZGUubWF0Y2goL1thLXpdezN9L2cpLFxuICAgICAgICAgICAgICAgIG5lZ2F0ZWQgPSBtb2RlLmluZGV4T2YoJyEnKSA9PT0gMDtcblxuICAgICAgICAgICAgdmFyIG1hdGNoZXIgPSBmdW5jdGlvbiAodHVuZSkge1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaGVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAocm9vdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlcyA9IG1hdGNoZXMgJiYgcm9vdHMuaW5kZXhPZih0dW5lLmFycmFuZ2VtZW50LnJvb3QpID4gLTE7XG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICBpZiAobW9kZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlcyA9IG1hdGNoZXMgJiYgbW9kZXMuaW5kZXhPZih0dW5lLnR1bmUubW9kZSkgPiAtMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5lZ2F0ZWQgPyAhbWF0Y2hlcyA6IG1hdGNoZXM7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBtYXRjaGVyc1tuZWdhdGVkID8gJ2FuZCcgOiAnb3InXS5wdXNoKG1hdGNoZXIpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJ1bk1hdGNoZXJzID0gZnVuY3Rpb24gKHR1bmUsIG1hdGNoZXJzKSB7XG4gICAgICAgICAgICB2YXIgbWF0Y2hlcixcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChtYXRjaGVycy5vci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBmb3IgKG1hdGNoZXIgaW4gbWF0Y2hlcnMub3IpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoZXJzLm9yW21hdGNoZXJdKHR1bmUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtYXRjaGVycy5hbmQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZm9yIChtYXRjaGVyIGluIG1hdGNoZXJzLmFuZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW1hdGNoZXJzLmFuZFttYXRjaGVyXSh0dW5lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9O1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlQ291bnRzICgpIHtcbiAgICAgICAgaWYgKCRzY29wZS5zZWFyY2hUZXJtKSB7cmV0dXJuO31cbiAgICAgICAgdmFyIGFsbFR1bmVzID0gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5hcHBseSh0dW5lTGlzdC5zZWxlY3RlZFR1bmVzLCB0dW5lTGlzdC5vdGhlclR1bmVzKTtcbiAgICAgICAgJHNjb3BlLmNvdW50cyA9IFtcbiAgICAgICAgICAgIGFsbFR1bmVzLmxlbmd0aCxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBub3c6IF8uZmlsdGVyKGFsbFR1bmVzLCBmdW5jdGlvbiAodHVuZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHVuZS5wZXJmb3JtYW5jZS5zdGFuZGFyZCA9PT0gMTtcbiAgICAgICAgICAgICAgICB9KS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgcGFzdDogXy5maWx0ZXIoYWxsVHVuZXMsIGZ1bmN0aW9uICh0dW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0dW5lLnBlcmZvcm1hbmNlLmJlc3QgPT09IDE7XG4gICAgICAgICAgICAgICAgfSkubGVuZ3RoXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5vdzogXy5maWx0ZXIoYWxsVHVuZXMsIGZ1bmN0aW9uICh0dW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0dW5lLnBlcmZvcm1hbmNlLnN0YW5kYXJkID09PSAyO1xuICAgICAgICAgICAgICAgIH0pLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBwYXN0OiBfLmZpbHRlcihhbGxUdW5lcywgZnVuY3Rpb24gKHR1bmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHR1bmUucGVyZm9ybWFuY2UuYmVzdCA9PT0gMjtcbiAgICAgICAgICAgICAgICB9KS5sZW5ndGhcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbm93OiBfLmZpbHRlcihhbGxUdW5lcywgZnVuY3Rpb24gKHR1bmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHR1bmUucGVyZm9ybWFuY2Uuc3RhbmRhcmQgPT09IDM7XG4gICAgICAgICAgICAgICAgfSkubGVuZ3RoLFxuICAgICAgICAgICAgICAgIHBhc3Q6IF8uZmlsdGVyKGFsbFR1bmVzLCBmdW5jdGlvbiAodHVuZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHVuZS5wZXJmb3JtYW5jZS5iZXN0ID09PSAzO1xuICAgICAgICAgICAgICAgIH0pLmxlbmd0aFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBub3c6IF8uZmlsdGVyKGFsbFR1bmVzLCBmdW5jdGlvbiAodHVuZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHVuZS5wZXJmb3JtYW5jZS5zdGFuZGFyZCA9PT0gNDtcbiAgICAgICAgICAgICAgICB9KS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgcGFzdDogXy5maWx0ZXIoYWxsVHVuZXMsIGZ1bmN0aW9uICh0dW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0dW5lLnBlcmZvcm1hbmNlLmJlc3QgPT09IDQ7XG4gICAgICAgICAgICAgICAgfSkubGVuZ3RoXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5vdzogXy5maWx0ZXIoYWxsVHVuZXMsIGZ1bmN0aW9uICh0dW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0dW5lLnBlcmZvcm1hbmNlLnN0YW5kYXJkID09PSA1O1xuICAgICAgICAgICAgICAgIH0pLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBwYXN0OiBfLmZpbHRlcihhbGxUdW5lcywgZnVuY3Rpb24gKHR1bmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHR1bmUucGVyZm9ybWFuY2UuYmVzdCA9PT0gNTtcbiAgICAgICAgICAgICAgICB9KS5sZW5ndGhcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcblxuICAgICAgICAkc2NvcGUuY291bnRzLnRvU2NyYXRjaCA9IHtcbiAgICAgICAgICAgIG5vdzogXy5maWx0ZXIoYWxsVHVuZXMsIGZ1bmN0aW9uICh0dW5lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHR1bmUucGVyZm9ybWFuY2Uuc3RhbmRhcmQgPiAyO1xuICAgICAgICAgICAgfSkubGVuZ3RoLFxuICAgICAgICAgICAgcGFzdDogXy5maWx0ZXIoYWxsVHVuZXMsIGZ1bmN0aW9uICh0dW5lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHR1bmUucGVyZm9ybWFuY2UuYmVzdCA+IDI7XG4gICAgICAgICAgICB9KS5sZW5ndGhcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAkc2NvcGUudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBpZiAodGhpcy50dW5lLmR1bW15U3RhbmRhcmQgPiAtMSkge1xuICAgICAgICAvLyAgICAgdHVuZUxpc3QubW92ZVRvQm90dG9tKHRoaXMudHVuZSk7ICAgIFxuICAgICAgICAvLyB9XG5cbiAgICAgICAgdGhpcy50dW5lLnVwZGF0ZSh7XG4gICAgICAgICAgICBwZXJmb3JtYW5jZTogdGhpcy50dW5lLnBlcmZvcm1hbmNlLFxuICAgICAgICAgICAgc2V0UHVibGljUGVyZm9ybWFuY2U6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAvL3VwZGF0ZUNvdW50cygpO1xuICAgIH07XG5cbiAgICAkc2NvcGUuc2VhcmNoVGVybSA9ICcnO1xuICAgICRzY29wZS5maWx0ZXJNb2RlID0gJyc7XG4gICAgJHNjb3BlLmZpbHRlclJoeXRobSA9ICcnO1xuICAgICRzY29wZS5zdW1tYXJ5Q29sbGFwc2VkID0gdHJ1ZTtcbiAgICAkcm9vdFNjb3BlLiRvbigndHVuZVByYWN0aWNlZCcsIGZ1bmN0aW9uIChldmVudCwgdHVuZSkge1xuICAgICAgICB0dW5lTGlzdC5tb3ZlVG9Cb3R0b20odHVuZSk7XG4gICAgICAgIHVwZGF0ZUNvdW50cygpO1xuXG4gICAgfSk7XG5cbiAgICAkc2NvcGUuc2VhcmNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJHNjb3BlLnNlYXJjaFRlcm0udHJpbSgpLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgICAgICRzY29wZS5maWx0ZXJNb2RlID0gJyc7XG4gICAgICAgICAgICAkc2NvcGUuZmlsdGVyUmh5dGhtID0gJyc7XG4gICAgICAgICAgICB0dW5lTGlzdC5yZWxpc3Qoe1xuICAgICAgICAgICAgICAgIGZpbHRlcjogZmlsdGVycy5zZWFyY2gsXG4gICAgICAgICAgICAgICAgc29ydDogc29ydGVycy5zZWFyY2gsXG4gICAgICAgICAgICAgICAgZm9yY2VSZWxpc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgbGltaXQ6IDBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHVuZUxpc3QucmVsaXN0KHtcbiAgICAgICAgICAgICAgICBmaWx0ZXI6IGZpbHRlcnMucHJhY3RpY2UsXG4gICAgICAgICAgICAgICAgc29ydDogc29ydGVycy5wcmFjdGljZSxcbiAgICAgICAgICAgICAgICBsaW1pdDogMTVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5maWx0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoJHNjb3BlLmZpbHRlck1vZGUudHJpbSgpIHx8ICRzY29wZS5maWx0ZXJSaHl0aG0udHJpbSgpKSB7XG4gICAgICAgICAgICAkc2NvcGUuc2VhcmNoVGVybSA9ICcnO1xuICAgICAgICAgICAgdHVuZUxpc3QucmVsaXN0KHtcbiAgICAgICAgICAgICAgICBmaWx0ZXI6IGdldEZpbHRlcigpLFxuICAgICAgICAgICAgICAgIHNvcnQ6IHNvcnRlcnMucHJhY3RpY2UsXG4gICAgICAgICAgICAgICAgZm9yY2VSZWxpc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgbGltaXQ6ICgkc2NvcGUuZmlsdGVyUmh5dGhtLnRyaW0oKSAmJiAkc2NvcGUuZmlsdGVyTW9kZS50cmltKCkpID8gMCA6IDIwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHR1bmVMaXN0LnJlbGlzdCh7XG4gICAgICAgICAgICAgICAgZmlsdGVyOiBmaWx0ZXJzLnByYWN0aWNlLFxuICAgICAgICAgICAgICAgIHNvcnQ6IHNvcnRlcnMucHJhY3RpY2UsXG4gICAgICAgICAgICAgICAgbGltaXQ6IDE1XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUuZmlsdGVycyA9IGZpbHRlcnM7XG4gICAgJHNjb3BlLnNvcnRlcnMgPSBzb3J0ZXJzO1xuXG4gICAgalBhZ2VTdGF0ZS5zZXQoe1xuICAgICAgICBzZWN0aW9uOiAndHVuZXMnLFxuICAgICAgICBpbnN0cnVtZW50OiAkcm91dGVQYXJhbXMuaW5zdHJ1bWVudCxcbiAgICAgICAgcGF0aDogJy90dW5lcydcbiAgICB9KTtcblxuICAgIHZhciB0dW5lTGlzdCA9IGpUdW5lTGlzdCh7XG4gICAgICAgICRzY29wZTogJHNjb3BlLFxuICAgICAgICBmaWx0ZXI6IGZpbHRlcnMucHJhY3RpY2UsXG4gICAgICAgIHNvcnQ6IHNvcnRlcnMucHJhY3RpY2UsXG4gICAgICAgIHR1bmVNb2RpZmllcjogZnVuY3Rpb24gKHR1bmUpIHtcbiAgICAgICAgICAgIHR1bmUuZHVtbXlTdGFuZGFyZCA9IC0xO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB0cnkge1xuICAgICAgICB1cGRhdGVDb3VudHMoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICRzY29wZS4kb24oJ3R1bmVzTGlzdGVkJywgZnVuY3Rpb24gKGV2ZW50LCBsaXN0KSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGlmIChsaXN0ID09PSB0dW5lTGlzdCkge1xuICAgICAgICAgICAgdXBkYXRlQ291bnRzKCk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgIH0pO1xuICAgIH0gICAgXG59OyIsInZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbnJlcXVpcmUoJ3NyYy9jb21tb24vdWkvbW9kYWxzJyk7XG5yZXF1aXJlKCdzcmMvdHVuZS91aS90dW5lLWhlYWRpbmcnKTtcbnJlcXVpcmUoJ3NyYy90dW5lL3VpL3BlcmZvcm1hbmNlLXJhdGVyJyk7XG5yZXF1aXJlKCdzcmMvdHVuZS1saXN0cy9zZXJ2aWNlcy90dW5lLWxpc3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoXG4gICAgJHNjb3BlLFxuICAgICRyb290U2NvcGUsXG4gICAgalR1bmVMaXN0LFxuICAgIGpNb2RhbHNcbikge1xuXG4gICAgJHJvb3RTY29wZS5zaG93TmV3VHVuZXMgPSBmYWxzZTtcblxuICAgIHZhciBnZXRQZXJmb3JtYW5jZUZvckluc3RydW1lbnQgPSBmdW5jdGlvbiAodHVuZSwgaW5zdHJ1bWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIChfLmZpbmRXaGVyZSh0dW5lLnR1bmUucGVyZm9ybWFuY2VzLCB7XG4gICAgICAgICAgICAgICAgICAgIGluc3RydW1lbnQ6IGluc3RydW1lbnRcbiAgICAgICAgICAgICAgICB9KSB8fCB7XG4gICAgICAgICAgICAgICAgICAgIGluc3RydW1lbnQ6IGluc3RydW1lbnQsXG4gICAgICAgICAgICAgICAgICAgIGR1bW15OiB0cnVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGlzTmV3ID0gZnVuY3Rpb24gKHR1bmUpIHtcbiAgICAgICAgICAgIHJldHVybiB0dW5lLmlzTmV3KCk7XG4gICAgICAgIH07XG5cbiAgICAkc2NvcGUubGFzdFR1bmVSZW1vdmVkO1xuXG4gICAgJHNjb3BlLmZpbmlzaGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0dW5lTGlzdC5yZW1vdmUodGhpcy50dW5lKTtcbiAgICAgICAgaWYgKCEkc2NvcGUubmV3VHVuZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLnNob3dOZXdUdW5lcyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS51bmRvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0dW5lTGlzdC51bmRvUmVtb3ZlKCk7XG4gICAgfTtcblxuICAgICRzY29wZS51cGRhdGUgPSBmdW5jdGlvbiAob2xkVmFsdWUpIHtcbiAgICAgICAgdGhpcy50dW5lLnVwZGF0ZSh7XG4gICAgICAgICAgICBvbGRQcm9wczogb2xkVmFsdWUsXG4gICAgICAgICAgICBzZXRQdWJsaWNQZXJmb3JtYW5jZTogdHJ1ZVxuICAgICAgICB9KTsgICAgICAgXG4gICAgfTsgXG5cbiAgICB2YXIgcGVyZm9ybWFuY2VFZGl0b3I7XG5cbiAgICAkc2NvcGUuZWRpdFBlcmZvcm1hbmNlRm9ySW5zdHJ1bWVudCA9IGZ1bmN0aW9uIChpbnN0cnVtZW50KSB7XG4gICAgICAgIHRoaXMudHVuZS5wZXJmb3JtYW5jZSA9IGdldFBlcmZvcm1hbmNlRm9ySW5zdHJ1bWVudCh0aGlzLnR1bmUsIGluc3RydW1lbnQpO1xuICAgICAgICB0aGlzLmluc3RydW1lbnQgPSBpbnN0cnVtZW50O1xuICAgICAgICBwZXJmb3JtYW5jZUVkaXRvciA9IGpNb2RhbHMub3BlbigncGVyZm9ybWFuY2VFZGl0b3InLCB0aGlzKTtcbiAgICB9O1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiB0cmlja3kgdG8gdGVzdCAqL1xuICAgICRzY29wZS5maW5pc2hQZXJmb3JtYW5jZUVkaXQgPSBmdW5jdGlvbiAodHVuZSkge1xuICAgICAgICB0dW5lLnBlcmZvcm1hbmNlID0ge1xuICAgICAgICAgICAgZHVtbXk6IHRydWVcbiAgICAgICAgfTtcbiAgICAgICAgcGVyZm9ybWFuY2VFZGl0b3IuZGlzbWlzcygpO1xuICAgIH07XG5cbiAgICB2YXIgdHVuZUxpc3QgPSBqVHVuZUxpc3Qoe1xuICAgICAgICAkc2NvcGU6ICRzY29wZSxcbiAgICAgICAgbGlzdE5hbWU6ICduZXdUdW5lcycsXG4gICAgICAgIGZpbHRlcjogaXNOZXcsXG4gICAgICAgIGxpbWl0OiA0XG4gICAgfSk7XG5cbiAgICAkcm9vdFNjb3BlLm5ld1R1bmVDb3VudCA9IHR1bmVMaXN0LnR1bmVDb3VudDtcbiAgICAkc2NvcGUuJG9uKCd0dW5lc0xpc3RlZCcsIGZ1bmN0aW9uIChldmVudCwgdHVuZUxpc3QpIHtcbiAgICAgICAgJHJvb3RTY29wZS5uZXdUdW5lQ291bnQgPSB0dW5lTGlzdC50dW5lQ291bnQ7XG4gICAgfSk7XG5cbiAgICAkcm9vdFNjb3BlLiRvbignbmV3VHVuZXNGZXRjaGVkJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHR1bmVMaXN0LnJlbGlzdCh7XG4gICAgICAgICAgICBmb3JjZVJlbGlzdDogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCdzcmMvY29tbW9uL21vZHVsZScpO1xucmVxdWlyZSgnc3JjL3R1bmUvbW9kdWxlJyk7XG5cbnZhciBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpLFxuICAgIHR1bmVMaXN0c01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdqbnIudHVuZS1saXN0cycsIFsnam5yLmNvbW1vbicsICdqbnIudHVuZSddKSxcbiAgICByZWFkQ29va2llID0gcmVxdWlyZSgnc3JjL2NvbW1vbi9zZXJ2aWNlcy9yZWFkLWNvb2tpZScpLFxuICAgIGxpc3RUdW5lcyA9IHJlcXVpcmUoJ3NyYy90dW5lLWxpc3RzL2NvbnRyb2xsZXJzL2xpc3QtdHVuZXMnKSxcbiAgICBuZXdUdW5lcyA9IHJlcXVpcmUoJ3NyYy90dW5lLWxpc3RzL2NvbnRyb2xsZXJzL25ldy10dW5lcycpO1xuICAgICAgICBcbm1vZHVsZS5leHBvcnRzID0gdHVuZUxpc3RzTW9kdWxlXG4gICAgLmNvbnRyb2xsZXIoJ2xpc3RUdW5lcycsIGxpc3RUdW5lcylcbiAgICAuY29udHJvbGxlcignbmV3VHVuZXMnLCBuZXdUdW5lcylcbiAgICAuY29uZmlnKGZ1bmN0aW9uICgkcm91dGVQcm92aWRlcikge1xuICAgIFxuICAgICAgICAkcm91dGVQcm92aWRlci53aGVuKCcvdHVuZXMnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zcmMvdHVuZS1saXN0cy90cGwvbGlzdC10dW5lcy5odG1sJ1xuICAgICAgICB9KS53aGVuKCcvdHVuZXMvOmluc3RydW1lbnQnLCB7XG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zcmMvdHVuZS1saXN0cy90cGwvbGlzdC10dW5lcy5odG1sJ1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuIiwicmVxdWlyZSgnc3JjL2NvbW1vbi9kYXRhL2RhdGFiYXNlJyk7XG5yZXF1aXJlKCdzcmMvY29tbW9uL3VpL21vZGFscycpO1xucmVxdWlyZSgnc3JjL3R1bmUvc2VydmljZXMvdHVuZS1tb2RlbCcpO1xucmVxdWlyZSgnc3JjL2NvbW1vbi9zZXJ2aWNlcy9wYWdlLXN0YXRlJyk7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbnJlcXVpcmUoJ2FuZ3VsYXInKS5tb2R1bGUoJ2puci50dW5lLWxpc3RzJykuZmFjdG9yeSgnalR1bmVMaXN0JywgZnVuY3Rpb24gKFxuICAgICRyb290U2NvcGUsIFxuICAgIGpEYXRhYmFzZSwgXG4gICAgak1vZGFscyxcbiAgICBqUGFnZVN0YXRlLFxuICAgIGpUdW5lXG4pIHtcblxuICAgIHZhciBhbGxUdW5lcyA9IGpEYXRhYmFzZS5nZXRUYWJsZSgndHVuZXMnKSxcblxuICAgICAgICBleHBhbmRUdW5lID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICAgICAgICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuICAgICAgICAgICAgJHJvb3RTY29wZS5hY3RpdmVUdW5lID0gdGhpcy50dW5lO1xuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzQ29sbGFwc2VkID0gIW9wdHMuZWRpdDtcbiAgICAgICAgICAgIHRoaXMuc2hvd1BlcmZvcm1hbmNlID0gIW9wdHMubm9QZXJmb3JtYW5jZTtcbiAgICAgICAgICAgIGpNb2RhbHMub3BlbigndHVuZVZpZXdlcicsIHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudHVuZS51cGRhdGUoKTtcbiAgICAgICAgfSxcblxuICAgICAgICB0dW5lTGlzdEZhY3RvcnkgPSBmdW5jdGlvbiAoY29uZikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBUdW5lTGlzdChjb25mKTtcbiAgICAgICAgfSxcblxuICAgICAgICBUdW5lTGlzdCA9IGZ1bmN0aW9uIChjb25mKSB7XG4gICAgICAgICAgICB0aGlzLmNvbmYgPSBjb25mO1xuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIH07XG5cbiAgICBUdW5lTGlzdC5wcm90b3R5cGUgPSB7XG4gICAgICAgIFxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLiRzY29wZSA9IHRoaXMuY29uZi4kc2NvcGU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMudHVuZU1vZGlmaWVyID0gdGhpcy5jb25mLnR1bmVNb2RpZmllciB8fCBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICAgIHRoaXMubGlzdE5hbWUgPSB0aGlzLmNvbmYubGlzdE5hbWUgfHwgJ3R1bmVzJztcbiAgICAgICAgICAgIHRoaXMuc2V0UGFyYW1zKHRoaXMuY29uZik7XG4gICAgICAgICAgICB0aGlzLnR1bmVDb3VudCA9IDA7XG5cbiAgICAgICAgICAgIGlmICghYWxsVHVuZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kc2NvcGUuJG9uKCdqRGF0YUxvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wb3B1bGF0ZUxpc3QoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUxpc3QoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy4kc2NvcGUuZXhwYW5kVHVuZSA9IHRoaXMuJHNjb3BlLmV4cGFuZFR1bmUgfHwgZXhwYW5kVHVuZTtcbiAgICAgICAgICAgIHRoaXMuJHNjb3BlLnVwZGF0ZSA9IHRoaXMuJHNjb3BlLnVwZGF0ZSB8fCB1cGRhdGU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldFBhcmFtczogZnVuY3Rpb24gKGNvbmYpIHtcbiAgICAgICAgICAgIHRoaXMuc29ydCA9IGNvbmYuc29ydCAhPT0gdW5kZWZpbmVkID8gY29uZi5zb3J0IDogdGhpcy5zb3J0O1xuICAgICAgICAgICAgdGhpcy5maWx0ZXIgPSBjb25mLmZpbHRlciAhPT0gdW5kZWZpbmVkID8gY29uZi5maWx0ZXIgOiB0aGlzLmZpbHRlcjtcbiAgICAgICAgICAgIHRoaXMubGltaXQgPSBjb25mLmxpbWl0ICE9PSB1bmRlZmluZWQgPyBjb25mLmxpbWl0IDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGltaXQgPT09IHVuZGVmaW5lZCA/IDE1IDogdGhpcy5saW1pdDtcbiAgICAgICAgfSxcbiAgICAgICAgcG9wdWxhdGVMaXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICAgICAgdHVuZXMgPSBbXTtcblxuICAgICAgICAgICAgYWxsVHVuZXMubWFwKGZ1bmN0aW9uICh0dW5lKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFnZ3JlZ2F0ZXMgPSBqVHVuZS5leHRyYWN0KHR1bmUsIHtcbiAgICAgICAgICAgICAgICAgICAgcGVyZm9ybWFuY2VGaWx0ZXI6IGZ1bmN0aW9uIChwZXJmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGVyZi5pbnN0cnVtZW50ID09PSAkcm9vdFNjb3BlLnBhZ2VTdGF0ZS5pbnN0cnVtZW50O1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBsaXN0OiB0dW5lc1xuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kaWZpZXI6IHNlbGYudHVuZU1vZGlmaWVyXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICh0aGlzLmZpbHRlcikge1xuICAgICAgICAgICAgICAgIHR1bmVzID0gXy5maWx0ZXIodHVuZXMsIHRoaXMuZmlsdGVyKTsgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnR1bmVDb3VudCA9IHR1bmVzLmxlbmd0aDtcbiAgICAgICAgICAgIGlmICh0aGlzLnNvcnQpIHtcbiAgICAgICAgICAgICAgICB0dW5lcyA9IF8uc29ydEJ5KHR1bmVzLCB0aGlzLnNvcnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMubGltaXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkVHVuZXMgPSBfLmZpcnN0KHR1bmVzLCB0aGlzLmxpbWl0KTtcbiAgICAgICAgICAgICAgICB0aGlzLm90aGVyVHVuZXMgPSBfLnJlc3QodHVuZXMsIHRoaXMubGltaXQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkVHVuZXMgPSB0dW5lcztcbiAgICAgICAgICAgICAgICB0aGlzLm90aGVyVHVuZXMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuJHNjb3BlW3RoaXMubGlzdE5hbWVdID0gdGhpcy5zZWxlY3RlZFR1bmVzO1xuICAgICAgICAgICAgdGhpcy4kc2NvcGUuJGVtaXQoJ3R1bmVzTGlzdGVkJywgdGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbGlzdDogZnVuY3Rpb24gKGNvbmYpIHtcbiAgICAgICAgICAgIHZhciBvbGRMaW1pdCA9IHRoaXMubGltaXQ7XG4gICAgICAgICAgICBpZiAoIWNvbmYuZm9yY2VSZWxpc3QpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29uZi5zb3J0ICYmIGNvbmYuc29ydCA9PT0gdGhpcy5zb3J0KSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjb25mLnNvcnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChjb25mLmZpbHRlciAmJiBjb25mLmZpbHRlciA9PT0gdGhpcy5maWx0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNvbmYuZmlsdGVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWNvbmYuZmlsdGVyICYmICFjb25mLnNvcnQgJiYgY29uZi5saW1pdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNldFBhcmFtcyhjb25mKTtcblxuICAgICAgICAgICAgaWYgKGNvbmYuc29ydCB8fCBjb25mLmZpbHRlcikge1xuICAgICAgICAgICAgICAgIHRoaXMucG9wdWxhdGVMaXN0KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb25mLmxpbWl0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIC8vY2hhbmdlIHRoZSBzaXplIG9mIHRoZSBsaXN0XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGltaXQgPT09IDAgJiYgb2xkTGltaXQgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodGhpcy5zZWxlY3RlZFR1bmVzLCB0aGlzLm90aGVyVHVuZXMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm90aGVyVHVuZXMgPSBbXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9sZExpbWl0ID4gdGhpcy5saW1pdCkge1xuICAgICAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUudW5zaGlmdC5hcHBseSh0aGlzLm90aGVyVHVuZXMsIHRoaXMuc2VsZWN0ZWRUdW5lcy5zcGxpY2UodGhpcy5saW1pdCwgb2xkTGltaXQgLSB0aGlzLmxpbWl0KSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvbGRMaW1pdCA8IHRoaXMubGltaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodGhpcy5zZWxlY3RlZFR1bmVzLCB0aGlzLm90aGVyVHVuZXMuc3BsaWNlKDAsIHRoaXMubGltaXQgLSBvbGRMaW1pdCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUxpc3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbW92ZVRvQm90dG9tOiBmdW5jdGlvbiAodHVuZSkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFR1bmVzLnNwbGljZSh0aGlzLnNlbGVjdGVkVHVuZXMuaW5kZXhPZih0dW5lKSwgMSk7XG4gICAgICAgICAgICBpZiAodGhpcy5vdGhlclR1bmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMub3RoZXJUdW5lcy5wdXNoKHR1bmUpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRUdW5lcy5wdXNoKHRoaXMub3RoZXJUdW5lcy5zaGlmdCgpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gdGltZW91dCBwcmV2ZW50cyBhIG1vdmUgZXZlbnQgdHJpZ2dlcmluZyBpbnN0ZWFkIG9mIGEgbGVhdmUgZXZlbnRcbiAgICAgICAgICAgICAgICAvLyBhbmQgaGVuY2UgbWFrZXMgc3VyZSB0aGUgYW5pbWF0aW9uIGhhcHBlbnNcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFR1bmVzLnB1c2godHVuZSk7XG4gICAgICAgICAgICAgICAgfSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gKHR1bmUpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuc2VsZWN0ZWRUdW5lcy5pbmRleE9mKHR1bmUpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFR1bmVzLnNwbGljZShpbmRleCwgMSApO1xuICAgICAgICAgICAgdGhpcy5sYXN0UmVtb3ZlZCA9IFtpbmRleCwgdHVuZV07XG4gICAgICAgICAgICB0aGlzLiRzY29wZS5sYXN0UmVtb3ZlZCA9IHRydWU7XG4gICAgICAgICAgICBpZiAodGhpcy5vdGhlclR1bmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRUdW5lcy5wdXNoKHRoaXMub3RoZXJUdW5lcy5zaGlmdCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdW5kb1JlbW92ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5vdGhlclR1bmVzLnVuc2hpZnQodGhpcy5zZWxlY3RlZFR1bmVzLnBvcCgpKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRUdW5lcy5zcGxpY2UodGhpcy5sYXN0UmVtb3ZlZFswXSwgMCwgdGhpcy5sYXN0UmVtb3ZlZFsxXSk7XG4gICAgICAgICAgICB0aGlzLiRzY29wZS5sYXN0UmVtb3ZlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5sYXN0UmVtb3ZlZCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIHR1bmVMaXN0RmFjdG9yeTtcbn0pOyAiLCJyZXF1aXJlKCdzcmMvdHVuZS91aS9kcmF3LXNjb3JlJyk7XG5yZXF1aXJlKCdzcmMvY29tbW9uL2RhdGEvZGF0YWJhc2UnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoXG4gICAgJHNjb3BlLFxuICAgIGpUdW5lXG4pIHtcblxuICAgICRzY29wZS5uZXdUdW5lID0ge1xuICAgICAgICBwZXJmb3JtYW5jZToge31cbiAgICB9O1xuXG4gICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChqVHVuZS5jcmVhdGUoJHNjb3BlLm5ld1R1bmUpKSB7XG4gICAgICAgICAgICAkc2NvcGUuJGRpc21pc3MoKTtcbiAgICAgICAgfSBcbiAgICB9O1xuICAgIFxufTsiLCIndXNlIHN0cmljdCc7XG52YXIgYW5ndWxhciA9IHJlcXVpcmUoJ2FuZ3VsYXInKTtcbnJlcXVpcmUoJ3NyYy90dW5lL3VpL2RyYXctc2NvcmUnKTtcbnJlcXVpcmUoJ3NyYy90dW5lL3VpL3BlcmZvcm1hbmNlLXJhdGVyJyk7XG5yZXF1aXJlKCdzcmMvY29tbW9uL3VpL21vZGFscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChcbiAgICAkc2NvcGUsIFxuICAgIGpNb2RhbHNcbikge1xuXG4gICAgJHNjb3BlLnR1bmUgPSAkc2NvcGUuYWN0aXZlVHVuZTtcbiAgICAkc2NvcGUudHVuZS5kdW1teVN0YW5kYXJkID0gLTE7XG4gICAgJHNjb3BlLmVkaXRpbmdBYmMgPSBmYWxzZTtcbiAgICAkc2NvcGUuaXNOZXdBYmMgPSBmYWxzZTtcblxuICAgIHZhciBvbGRBcnJhbmdlbWVudFZhbHVlLFxuICAgICAgICBhcnJhbmdlbWVudENvbmZpcm07XG5cbiAgICAkc2NvcGUudXBkYXRlID0gZnVuY3Rpb24gKHJlZHJhd1Njb3JlKSB7XG5cbiAgICAgICAgaWYoJHNjb3BlLnR1bmUudXBkYXRlKHtcbiAgICAgICAgICAgIHBlcmZvcm1hbmNlOiAkc2NvcGUudHVuZS5wZXJmb3JtYW5jZSxcbiAgICAgICAgICAgIHNldFB1YmxpY1BlcmZvcm1hbmNlOiB0cnVlLFxuICAgICAgICAgICAgdXBkYXRlU2NvcmU6IHJlZHJhd1Njb3JlXG4gICAgICAgIH0pLnByYWN0aWNlZCkge1xuICAgICAgICAgICAgJHNjb3BlLiRkaXNtaXNzKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLmVkaXRBYmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5lZGl0YWJsZVNjb3JlR2VuZXJhdG9yID0gYW5ndWxhci5jb3B5KCRzY29wZS50dW5lLnNjb3JlR2VuZXJhdG9yKTsgIFxuICAgICAgICAkc2NvcGUuZWRpdGluZ0FiYyA9IHRydWU7XG4gICAgICAgICRzY29wZS5pc05ld0FiYyA9IGZhbHNlO1xuICAgIH07XG5cbiAgICAkc2NvcGUubmV3QWJjID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuZWRpdGFibGVTY29yZUdlbmVyYXRvciA9IGFuZ3VsYXIuY29weSgkc2NvcGUudHVuZS5zY29yZUdlbmVyYXRvcik7ICBcbiAgICAgICAgJHNjb3BlLmVkaXRhYmxlU2NvcmVHZW5lcmF0b3IuYXJyYW5nZW1lbnQuYWJjID0gJyc7IFxuICAgICAgICAkc2NvcGUuZWRpdGluZ0FiYyA9IHRydWU7XG4gICAgICAgICRzY29wZS5pc05ld0FiYyA9IHRydWU7XG4gICAgfTtcblxuICAgICRzY29wZS51cGRhdGVBcnJhbmdlbWVudCA9IGZ1bmN0aW9uIChvbGRWYWx1ZSkge1xuICAgICAgICBvbGRBcnJhbmdlbWVudFZhbHVlID0gb2xkVmFsdWU7XG4gICAgICAgIGFycmFuZ2VtZW50Q29uZmlybSA9IGpNb2RhbHMub3BlbignYXJyYW5nZW1lbnRDb25maXJtJywgJHNjb3BlKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNhdmVUaGlzQWJjID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUudHVuZS5hcnJhbmdlbWVudC5hYmMgPSBlZGl0ZWRBYmM7XG4gICAgICAgIGVkaXRlZEFiYyA9IG51bGw7XG4gICAgICAgICRzY29wZS50dW5lLnVwZGF0ZSh7XG4gICAgICAgICAgICB1cGRhdGVTY29yZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgYWJjQ29uZmlybS5kaXNtaXNzKCk7XG4gICAgfTtcblxuICAgICRzY29wZS5zYXZlTmV3QWJjID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbmV3QXJyYW5nZW1lbnQgPSBhbmd1bGFyLmV4dGVuZCh7fSwgJHNjb3BlLnR1bmUuYXJyYW5nZW1lbnQpO1xuICAgICAgICBuZXdBcnJhbmdlbWVudC5hYmMgPSBlZGl0ZWRBYmM7XG4gICAgICAgIGVkaXRlZEFiYyA9IG51bGw7XG4gICAgICAgICRzY29wZS50dW5lLnVwZGF0ZSh7XG4gICAgICAgICAgICBhcnJhbmdlbWVudDogbmV3QXJyYW5nZW1lbnQsXG4gICAgICAgICAgICB1c2VBcnJhbmdlbWVudDogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgYWJjQ29uZmlybSAmJiBhYmNDb25maXJtLmRpc21pc3MoKTtcbiAgICB9O1xuXG4gICAgdmFyIGVkaXRlZEFiYyxcbiAgICAgICAgYWJjQ29uZmlybTtcblxuICAgICRzY29wZS5zYXZlQWJjRGlhbG9nID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIFxuICAgICAgICBlZGl0ZWRBYmMgPSAkc2NvcGUuZWRpdGFibGVTY29yZUdlbmVyYXRvci5hcnJhbmdlbWVudC5hYmM7XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuZWRpdGluZ0FiYyA9IGZhbHNlO1xuICAgICAgICBpZiAoJHNjb3BlLmlzTmV3QWJjKSB7XG4gICAgICAgICAgICAkc2NvcGUuc2F2ZU5ld0FiYygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWJjQ29uZmlybSA9IGpNb2RhbHMub3BlbignYWJjQ29uZmlybScsICRzY29wZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLmNhbmNlbEFiY0VkaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5lZGl0aW5nQWJjID0gZmFsc2U7XG4gICAgfTtcblxuICAgICRzY29wZS5hbHRlckFycmFuZ2VtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUudHVuZS51cGRhdGUoe1xuICAgICAgICAgICAgdXBkYXRlU2NvcmU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIGFycmFuZ2VtZW50Q29uZmlybS5kaXNtaXNzKCk7XG4gICAgfTtcblxuICAgICRzY29wZS5jYW5jZWxBcnJhbmdlbWVudEVkaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFuZ3VsYXIuZXh0ZW5kKCRzY29wZS50dW5lLmFycmFuZ2VtZW50LCBvbGRBcnJhbmdlbWVudFZhbHVlKTtcbiAgICAgICAgb2xkQXJyYW5nZW1lbnRWYWx1ZSA9IG51bGw7XG4gICAgICAgIGFycmFuZ2VtZW50Q29uZmlybS5kaXNtaXNzKCk7XG4gICAgfTtcblxuICAgICRzY29wZS5zYXZlTmV3QXJyYW5nZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBuZXdBcnJhbmdlbWVudCA9IGFuZ3VsYXIuZXh0ZW5kKHt9LCAkc2NvcGUudHVuZS5hcnJhbmdlbWVudCk7XG4gICAgICAgIGFuZ3VsYXIuZXh0ZW5kKCRzY29wZS50dW5lLmFycmFuZ2VtZW50LCBvbGRBcnJhbmdlbWVudFZhbHVlKTtcbiAgICAgICAgb2xkQXJyYW5nZW1lbnRWYWx1ZSA9IG51bGw7XG4gICAgICAgICRzY29wZS50dW5lLnVwZGF0ZSh7XG4gICAgICAgICAgICBhcnJhbmdlbWVudDogbmV3QXJyYW5nZW1lbnQsXG4gICAgICAgICAgICB1c2VBcnJhbmdlbWVudDogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgYXJyYW5nZW1lbnRDb25maXJtLmRpc21pc3MoKTtcbiAgICB9O1xuXG5cbiAgICAkc2NvcGUuc2F2ZUFiY1RvUGVyZm9ybWFuY2UgPSBmdW5jdGlvbiAobmV3UGVyZm9ybWFuY2UpIHtcbiAgICAgICAgaWYgKG5ld1BlcmZvcm1hbmNlKSB7XG4gICAgICAgICAgICAkc2NvcGUudHVuZS51cGRhdGUoe1xuICAgICAgICAgICAgICAgIHBlcmZvcm1hbmNlOiB7XG4gICAgICAgICAgICAgICAgICAgIGR1bW15OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBhcnJhbmdlbWVudDogJHNjb3BlLnR1bmUuYXJyYW5nZW1lbnQuX2lkLFxuICAgICAgICAgICAgICAgICAgICBpbnN0cnVtZW50OiAkc2NvcGUudHVuZS5wZXJmb3JtYW5jZS5pbnN0cnVtZW50XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzZXRQdWJsaWNQZXJmb3JtYW5jZTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkc2NvcGUudHVuZS5wZXJmb3JtYW5jZS5hcnJhbmdlbWVudCA9ICRzY29wZS50dW5lLmFycmFuZ2VtZW50Ll9pZDtcbiAgICAgICAgICAgICRzY29wZS50dW5lLnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuYWJjU2F2ZVBlbmRpbmcgPSBmYWxzZTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnJldmVydEFiYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLnR1bmUucmVzZXRBcnJhbmdlbWVudCgpO1xuICAgICAgICAkc2NvcGUuYWJjU2F2ZVBlbmRpbmcgPSBmYWxzZTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmFiY1NhdmVQZW5kaW5nID0gZmFsc2U7XG5cbiAgICAkc2NvcGUubmV4dEFiYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFycmFuZ2VtZW50cyA9ICRzY29wZS50dW5lLnR1bmUuYXJyYW5nZW1lbnRzO1xuICAgICAgICAkc2NvcGUudHVuZS5uZXh0QXJyYW5nZW1lbnQoKTtcbiAgICAgICAgLy8gJHNjb3BlLnR1bmUuYXJyYW5nZW1lbnQgPSBhcnJhbmdlbWVudHNbKGFycmFuZ2VtZW50cy5pbmRleE9mKCRzY29wZS50dW5lLmFycmFuZ2VtZW50KSArIDEpICUgYXJyYW5nZW1lbnRzLmxlbmd0aF07XG4gICAgICAgICRzY29wZS5hYmNTYXZlUGVuZGluZyA9ICgkc2NvcGUudHVuZS5hcnJhbmdlbWVudC5faWQgIT09ICRzY29wZS50dW5lLnBlcmZvcm1hbmNlLmFycmFuZ2VtZW50KTtcbiAgICB9O1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJ3NyYy9jb21tb24vbW9kdWxlJyk7XG5cbnZhciBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpLFxuICAgIHR1bmVNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnam5yLnR1bmUnLCBbJ2puci5jb21tb24nXSk7XG5cbm1vZHVsZS5leHBvcnRzID0gdHVuZU1vZHVsZVxuICAgIC5jb250cm9sbGVyKCd0dW5lVmlld2VyJywgcmVxdWlyZSgnc3JjL3R1bmUvY29udHJvbGxlcnMvdHVuZS12aWV3ZXInKSlcbiAgICAuY29udHJvbGxlcignYWRkVHVuZScsIHJlcXVpcmUoJ3NyYy90dW5lL2NvbnRyb2xsZXJzL2FkZC10dW5lJykpXG4gICAgLmZpbHRlcigndHVuZVN0YXRTdW1tYXJ5JywgcmVxdWlyZSgnc3JjL3R1bmUvdWkvdHVuZS1zdGF0LXN1bW1hcnknKSk7IiwidmFyIHNjYWxlID0gJ2NkZWZnYWInLFxuICAgIHJvb3RzID0gW1xuICAgICAgICAnQycsICdEYicsICdEJywgJ0ViJywgJ0UnLCAnRicsICdHYicsICdHJywgJ0FiJywgJ0EnLCAnQmInLCAnQicsIFxuICAgICAgICAnQycsICdDIycsICdEJywgJ0QjJywgJ0UnLCAnRicsICdGIycsICdHJywgJ0cjJywgJ0EnLCAnQSMnLCAnQidcbiAgICBdLCBcbiAgICBlcXVpdmFsZW50Um9vdHMgPSB7XG4gICAgICAgICdBIyc6ICdCYicsXG4gICAgICAgICdHIyc6ICdBYicsXG4gICAgICAgICdDIyc6ICdEYicsXG4gICAgICAgICdEIyc6ICdFYicsXG4gICAgICAgICdHYic6ICdGIycsXG4gICAgICAgICdGYic6ICdFJyxcbiAgICAgICAgJ0NiJzogJ0InLFxuICAgICAgICAnQiMnOiAnQycsXG4gICAgICAgICdFIyc6ICdGJ1xuICAgIH0sXG4gICAgbW9kZXMgPSBbXG4gICAgICAgICdtYWonLFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICdkb3InLFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICdwaHInLFxuICAgICAgICAnbHlkJyxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAnbWl4JyxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAnbWluJyxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAnbG9jJ1xuICAgIF0sXG4gICAgbWFqb3JLZXlTaWduYXR1cmVzID0ge1xuICAgICAgICBEYjogLTUsXG4gICAgICAgIEFiOiAtNCxcbiAgICAgICAgRWI6IC0zLFxuICAgICAgICBCYjogLTIsXG4gICAgICAgIEY6IC0xLFxuICAgICAgICBDOiAwLFxuICAgICAgICBHOiAxLFxuICAgICAgICBEOiAyLFxuICAgICAgICBBOiAzLFxuICAgICAgICBFOiA0LFxuICAgICAgICBCOiA1LFxuICAgICAgICAnRiMnOiA2XG4gICAgfSxcblxuICAgIGZ1bGxOb3RlUlggPSAvKD86XFw9fF98XFxeKT9bYS1nXSg/Oix8XFwnKSovZ2ksXG4gICAgYWNjaWRlbnRhbHNSWCA9IC9cXD18X3xcXF4vLFxuICAgIGxvd05vdGVSWCA9IC9bQS1HXS8sXG4gICAgXG4gICAgZXh0cmFjdGVkTm90ZXNDYWNoZSA9IHt9LFxuXG4gICAgX2dldEhpZ2hlc3RPckxvd2VzdE9mUGFpciA9IGZ1bmN0aW9uIChub3RlMSwgbm90ZTIsIGhpZ2hlc3QpIHtcbiAgICAgICAgXG4gICAgICAgIC8vU3RhcnQgYnkgaWRlbnRpZnlpbmcgdGhlIGxvd2VzdCBub3RlXG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyBjb21wYXJlIG9jdGF2ZXNcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5vdGUxWzFdIDwgbm90ZTJbMV0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gbm90ZTEgOlxuICAgICAgICAgICAgICAgICAgICBub3RlMVsxXSA+IG5vdGUyWzFdICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBub3RlMiA6XG4gICAgICAgICAgICAgICAgICAgIC8vY29tcGFyZSBwb3NpdGlvbiBpbiBzY2FsZVxuICAgICAgICAgICAgICAgICAgICBzY2FsZS5pbmRleE9mKG5vdGUxWzBdKSA8IHNjYWxlLmluZGV4T2Yobm90ZTJbMF0pICAgPyBub3RlMSA6XG4gICAgICAgICAgICAgICAgICAgIHNjYWxlLmluZGV4T2Yobm90ZTFbMF0pID4gc2NhbGUuaW5kZXhPZihub3RlMlswXSkgICA/IG5vdGUyIDpcbiAgICAgICAgICAgICAgICAgICAgLy9jb21wYXJlIGZsYXRuZXNzXG4gICAgICAgICAgICAgICAgICAgIG5vdGUxWzJdID09PSAnXycgPyBub3RlMSA6IFxuICAgICAgICAgICAgICAgICAgICBub3RlMlsyXSA9PT0gJ18nID8gbm90ZTIgOlxuICAgICAgICAgICAgICAgICAgICAvL2NvbXBhcmUgbmF0dXJhbG5lc3NcbiAgICAgICAgICAgICAgICAgICAgbm90ZTFbMl0gPT09ICc9JyA/IG5vdGUxIDpcbiAgICAgICAgICAgICAgICAgICAgbm90ZTJbMl0gPT09ICc9JyA/IG5vdGUyIDpcbiAgICAgICAgICAgICAgICAgICAgLy9jb21wYXJlIG5vdCBiZWluZyBzaGFycFxuICAgICAgICAgICAgICAgICAgICAhbm90ZTFbMl0gICAgICAgID8gbm90ZTEgOlxuICAgICAgICAgICAgICAgICAgICAhbm90ZTJbMl0gICAgICAgID8gbm90ZTIgOlxuICAgICAgICAgICAgICAgICAgICAvLyBpZiB3ZSBnZXQgaGVyZSBib3RoIG5vdGVzIGFyZSB0aGUgc2FtZSBub3RlIHNoYXJwZW5lZCBpbiB0aGUgc2FtZSBvY3R2ZSBzbyBkb2Vzbid0IG1hdHRlciB3aGljaCB3ZSByZXR1cm4gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90ZTE7XG4gICAgICAgIFxuICAgICAgICAvLyBpZiBsb29raW5nIGZvciBoaWdoZXN0IHJldHVybiB0aGUgb25lIHdlIGRpZG4ndCBpZGVudGlmeSBhYm92ZSAgICBcbiAgICAgICAgaWYgKGhpZ2hlc3QgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCA9PT0gbm90ZTEgPyBub3RlMiA6IG5vdGUxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIF9leHRyYWN0Tm90ZXMgPSBmdW5jdGlvbiAoYWJjKSB7XG5cbiAgICAgICAgaWYgKGV4dHJhY3RlZE5vdGVzQ2FjaGVbYWJjXSkge1xuICAgICAgICAgICAgcmV0dXJuIGV4dHJhY3RlZE5vdGVzQ2FjaGVbYWJjXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBub3RlcyA9IFtdO1xuXG4gICAgICAgIGFiYy5yZXBsYWNlKGZ1bGxOb3RlUlgsIGZ1bmN0aW9uICgkMCkge1xuICAgICAgICAgICAgbm90ZXMucHVzaChfZ2V0Tm90ZUNvb3JkcygkMCkpOyAgICAgICAgICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGV4dHJhY3RlZE5vdGVzQ2FjaGVbYWJjXSA9IG5vdGVzO1xuICAgIH0sXG5cbiAgICBfZ2V0SGlnaGVzdE9yTG93ZXN0SW5BYmMgPSBmdW5jdGlvbiAoYWJjLCBoaWdoZXN0KSB7XG4gICAgICAgIHZhciBub3RlcyA9IF9leHRyYWN0Tm90ZXMoYWJjKSxcbiAgICAgICAgICAgIGN1cnJlbnRFeHRyZW1lID0gbm90ZXNbMF07XG5cbiAgICAgICAgZm9yICh2YXIgbiA9IDEsIG5sID0gbm90ZXMubGVuZ3RoOyBuPG5sOyBuKyspIHtcbiAgICAgICAgICAgIGN1cnJlbnRFeHRyZW1lID0gX2dldEhpZ2hlc3RPckxvd2VzdE9mUGFpcihjdXJyZW50RXh0cmVtZSwgbm90ZXNbbl0sIGhpZ2hlc3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF9nZXROb3RlRnJvbUNvb3JkcyhjdXJyZW50RXh0cmVtZSk7XG4gICAgfSxcbiAgICBcbiAgICAvLyBfZ2V0RHVyYXRpb24gPSBmdW5jdGlvbiAoYWJjRnJhZ21lbnQpIHtcbiAgICAgICAgXG4gICAgLy8gICAgIHZhciBkdXJhdGlvbiA9IDA7XG4gICAgLy8gfSxcblxuICAgIF9nZXREaXJlY3Rpb25PZlRyYW5zcG9zaXRpb24gPSBmdW5jdGlvbiAoZGlyZWN0aW9uLCBpbnRlcnZhbCkge1xuICAgICAgICBpZiAoZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gZGlyZWN0aW9uID4gMCA/IDEgOiAtMTsgICAgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaW50ZXJ2YWwgPCA1ID8gMTogLTE7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2dldE5vdGVDb29yZHMgPSBmdW5jdGlvbiAobm90ZSkge1xuICAgICAgICB2YXIgYWNjaWRlbnRhbDtcbiAgICAgICAgaWYgKGFjY2lkZW50YWxzUlgudGVzdChub3RlLmNoYXJBdCgwKSkpIHtcbiAgICAgICAgICAgIGFjY2lkZW50YWwgPSBub3RlLmNoYXJBdCgwKTtcbiAgICAgICAgICAgIG5vdGUgPSBub3RlLnN1YnN0cigxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobG93Tm90ZVJYLnRlc3Qobm90ZS5jaGFyQXQoMCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gW25vdGUuY2hhckF0KDApLnRvTG93ZXJDYXNlKCksIDEgLSBub3RlLmxlbmd0aCwgYWNjaWRlbnRhbF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW25vdGUuY2hhckF0KDApLCBub3RlLmxlbmd0aCwgYWNjaWRlbnRhbF07XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2dldE5vdGVGcm9tQ29vcmRzID0gZnVuY3Rpb24gKG5vdGUpIHtcbiAgICAgICAgdmFyIG5vdGVTdHJpbmc7XG5cbiAgICAgICAgaWYgKG5vdGVbMV0gPCAxKSB7XG4gICAgICAgICAgICBub3RlU3RyaW5nID0gIG5vdGVbMF0udG9VcHBlckNhc2UoKSArIEFycmF5KDEgLSBub3RlWzFdKS5qb2luKCcsJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub3RlU3RyaW5nID0gIG5vdGVbMF0gKyBBcnJheShub3RlWzFdKS5qb2luKCdcXCcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChub3RlWzJdKSB7XG4gICAgICAgICAgICBub3RlU3RyaW5nID0gbm90ZVsyXSArIG5vdGVTdHJpbmc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vdGVTdHJpbmc7XG4gICAgfSxcblxuICAgIF9rZWVwSW5MaW1pdHMgPSBmdW5jdGlvbiAobm90ZSwgbG93ZXJCb3VuZCwgdXBwZXJCb3VuZCkge1xuICAgICAgICBcbiAgICAgICAgaWYgKGxvd2VyQm91bmQpIHtcbiAgICAgICAgICAgIGxvd2VyQm91bmQgPSBfZ2V0Tm90ZUNvb3Jkcyhsb3dlckJvdW5kKTtcbiAgICAgICAgICAgIGlmIChsb3dlckJvdW5kWzFdID49IG5vdGVbMV0pIHtcbiAgICAgICAgICAgICAgICBub3RlWzFdID0gbG93ZXJCb3VuZFsxXTtcbiAgICAgICAgICAgICAgICBpZiAoc2NhbGUuaW5kZXhPZihub3RlWzBdKSA8IHNjYWxlLmluZGV4T2YobG93ZXJCb3VuZFswXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbm90ZVsxXSsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1cHBlckJvdW5kKSB7XG4gICAgICAgICAgICB1cHBlckJvdW5kID0gX2dldE5vdGVDb29yZHModXBwZXJCb3VuZCk7XG4gICAgICAgICAgICBpZiAodXBwZXJCb3VuZFsxXSA8PSBub3RlWzFdKSB7XG4gICAgICAgICAgICAgICAgbm90ZVsxXSA9IHVwcGVyQm91bmRbMV07XG4gICAgICAgICAgICAgICAgaWYgKHNjYWxlLmluZGV4T2Yobm90ZVswXSkgPiBzY2FsZS5pbmRleE9mKHVwcGVyQm91bmRbMF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vdGVbMV0tLTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm90ZTtcbiAgICB9LFxuXG4gICAgdHJhbnNwb3NlID0gZnVuY3Rpb24gKGFiY0RlZiwgb3B0cykge1xuICAgICAgICB2YXIgaW50ZXJ2YWwgPSBzY2FsZS5pbmRleE9mKG9wdHMubmV3Um9vdC5zdWJzdHIoMCwgMSkudG9Mb3dlckNhc2UoKSkgLSBzY2FsZS5pbmRleE9mKGFiY0RlZi5yb290LnN1YnN0cigwLCAxKS50b0xvd2VyQ2FzZSgpKSxcbiAgICAgICAgICAgIGRpcmVjdGlvbiA9IF9nZXREaXJlY3Rpb25PZlRyYW5zcG9zaXRpb24ob3B0cy5kaXJlY3Rpb24sIGludGVydmFsKSxcbiAgICAgICAgICAgIGV4dHJhT2N0YXZlcyA9IG9wdHMuZGlyZWN0aW9uID8gKChvcHRzLmRpcmVjdGlvbiAvIGRpcmVjdGlvbikgLSAxKSA6IDA7XG4gICAgICAgIFxuICAgICAgICBpZiAoZGlyZWN0aW9uIDwgMCkge1xuICAgICAgICAgICAgaW50ZXJ2YWwgPSAtaW50ZXJ2YWw7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChpbnRlcnZhbCA8PSAwKSB7XG4gICAgICAgICAgICBpbnRlcnZhbCArPSA3OyAgXG4gICAgICAgIH1cbiAgICAgICAgIFxuICAgICAgICBpbnRlcnZhbCArPSBleHRyYU9jdGF2ZXMgKiA3O1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGFiY0RlZi5hYmMucmVwbGFjZShmdWxsTm90ZVJYLCBmdW5jdGlvbiAobm90ZSkge1xuICAgICAgICAgICAgbm90ZSA9IF9nZXROb3RlQ29vcmRzKG5vdGUpO1xuXG4gICAgICAgICAgICB2YXIgaW50ZXJ2YWxXaXRoaW5PY3RhdmUgPSAoaW50ZXJ2YWwgKiBkaXJlY3Rpb24pICUgNyxcbiAgICAgICAgICAgICAgICBuZXdOb3RlSW5kZXggPSBzY2FsZS5pbmRleE9mKG5vdGVbMF0pICsgaW50ZXJ2YWxXaXRoaW5PY3RhdmU7XG5cbiAgICAgICAgICAgIG5vdGVbMF0gPSBzY2FsZVsobmV3Tm90ZUluZGV4ICsgNykgJSA3XTtcblxuICAgICAgICAgICAgbm90ZVsxXSArPSBkaXJlY3Rpb24gKiBNYXRoLmZsb29yKGludGVydmFsIC8gNyk7XG5cbiAgICAgICAgICAgIGlmIChuZXdOb3RlSW5kZXggPCAwIHx8IG5ld05vdGVJbmRleCA+IDYpIHtcbiAgICAgICAgICAgICAgICBub3RlWzFdICs9IGRpcmVjdGlvbjsgIFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBub3RlID0gX2tlZXBJbkxpbWl0cyhub3RlLCBvcHRzLmxvd2VyTGltaXQsIG9wdHMudXBwZXJMaW1pdCk7XG4gICAgICAgICAgICByZXR1cm4gX2dldE5vdGVGcm9tQ29vcmRzKG5vdGUpO1xuICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgfSxcblxuICAgIC8vIGdldFByb3BzID0gZnVuY3Rpb24gKGFiY0RlZikge1xuXG4gICAgLy8gICAgIHJldHVybiB7XG4gICAgLy8gICAgICAgICBsb3dlc3Q6IGdldExvd2VzdE5vdGUoYWJjRGVmLmFiYywgZ2V0U2hhcnBzQW5kRmxhdHMoYWJjRGVmLnJvb3QsIGFiY0RlZi5tb2RlKSksXG4gICAgLy8gICAgICAgICBoaWdoZXN0OiBnZXRIaWdoZXN0Tm90ZShhYmNEZWYuYWJjLCBnZXRTaGFycHNBbmRGbGF0cyhhYmNEZWYucm9vdCwgYWJjRGVmLm1vZGUpKSxcbiAgICAvLyAgICAgICAgIC8vIGZpcnN0XG4gICAgLy8gICAgICAgICAvLyBsYXN0XG4gICAgLy8gICAgICAgICAvLyBsZWFkSW5MZW5ndGhcbiAgICAvLyAgICAgICAgIC8vIGxlYWRJblxuICAgIC8vICAgICAgICAga2V5U2lnbmF0dXJlOiBnZXRTaGFycHNBbmRGbGF0cyhhYmNEZWYucm9vdCwgYWJjRGVmLm1vZGUpXG4gICAgLy8gICAgIH07XG4gICAgLy8gfSxcblxuICAgIGdldFNoYXJwc0FuZEZsYXRzID0gZnVuY3Rpb24gKHJvb3QsIG1vZGUpIHtcblxuICAgICAgICB2YXIgZXF1aXZhbGVudE1ham9ySW5kZXggPSAocm9vdHMubGVuZ3RoICsgcm9vdHMuaW5kZXhPZihyb290KSAtIG1vZGVzLmluZGV4T2YobW9kZSkpICUgcm9vdHMubGVuZ3RoLFxuICAgICAgICAgICAgZXF1aXZhbGVudE1ham9yID0gcm9vdHNbZXF1aXZhbGVudE1ham9ySW5kZXhdO1xuXG4gICAgICAgIGVxdWl2YWxlbnRNYWpvciA9IGVxdWl2YWxlbnRSb290c1tlcXVpdmFsZW50TWFqb3JdIHx8IGVxdWl2YWxlbnRNYWpvcjtcblxuICAgICAgICByZXR1cm4gbWFqb3JLZXlTaWduYXR1cmVzW2VxdWl2YWxlbnRNYWpvcl07XG4gICAgfSxcblxuICAgIGdldExvd2VzdE5vdGUgPSBmdW5jdGlvbiAoYWJjKSB7XG4gICAgICAgIHJldHVybiBfZ2V0SGlnaGVzdE9yTG93ZXN0SW5BYmMoYWJjLCBmYWxzZSk7XG4gICAgfSxcbiAgICBcbiAgICBnZXRIaWdoZXN0Tm90ZSA9IGZ1bmN0aW9uIChhYmMpIHtcbiAgICAgICAgcmV0dXJuIF9nZXRIaWdoZXN0T3JMb3dlc3RJbkFiYyhhYmMsIHRydWUpO1xuICAgIH0sXG4gICAgY2xlYXJFeHRyYWN0ZWROb3RlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZXh0cmFjdGVkTm90ZXNDYWNoZSA9IHt9O1xuICAgIH07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHRyYW5zcG9zZTogdHJhbnNwb3NlLFxuICAgIGV4dHJhY3ROb3RlczogX2V4dHJhY3ROb3RlcyxcbiAgICAvLyBnZXRQcm9wczogZ2V0UHJvcHMsXG4gICAgZ2V0U2hhcnBzQW5kRmxhdHM6IGdldFNoYXJwc0FuZEZsYXRzLFxuICAgIGdldExvd2VzdE5vdGU6IGdldExvd2VzdE5vdGUsXG4gICAgZ2V0SGlnaGVzdE5vdGU6IGdldEhpZ2hlc3ROb3RlLFxuICAgIGNsZWFyRXh0cmFjdGVkTm90ZXM6IGNsZWFyRXh0cmFjdGVkTm90ZXNcbn07XG4iLCJyZXF1aXJlKCdhbmd1bGFyJykubW9kdWxlKCdqbnIudHVuZScpLnNlcnZpY2UoJ2pTY29yZVNuaXBwZXRzJywgZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGluZGV4ZWREQiA9IHdpbmRvdy5pbmRleGVkREIgfHwgbnVsbCxcbiAgICAgICAgc25pcHBldHNEQiA9IHtcbiAgICAgICAgICAgIG9wZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciB2ZXJzaW9uID0gMTtcbiAgICAgICAgICAgICAgICB2YXIgcmVxdWVzdCA9IGluZGV4ZWREQi5vcGVuKCdzY29yZS1zbmlwcGV0cycsIHZlcnNpb24pO1xuXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNuaXBwZXRzREIuZGIgPSBlLnRhcmdldC5yZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIC8vIERvIHNvbWUgbW9yZSBzdHVmZiBpbiBhIG1pbnV0ZVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvLyBXZSBjYW4gb25seSBjcmVhdGUgT2JqZWN0IHN0b3JlcyBpbiBhIHZlcnNpb25jaGFuZ2UgdHJhbnNhY3Rpb24uXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vbnVwZ3JhZGVuZWVkZWQgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkYiA9IGUudGFyZ2V0LnJlc3VsdDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBBIHZlcnNpb25jaGFuZ2UgdHJhbnNhY3Rpb24gaXMgc3RhcnRlZCBhdXRvbWF0aWNhbGx5LlxuICAgICAgICAgICAgICAgICAgICBlLnRhcmdldC50cmFuc2FjdGlvbi5vbmVycm9yID0gc25pcHBldHNEQi5vbmVycm9yO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKGRiLm9iamVjdFN0b3JlTmFtZXMuY29udGFpbnMoJ3NuaXBwZXRzJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLmRlbGV0ZU9iamVjdFN0b3JlKCdzbmlwcGV0cycpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0b3JlID0gZGIuY3JlYXRlT2JqZWN0U3RvcmUoJ3NuaXBwZXRzJywge2tleVBhdGg6ICdhcnJhbmdlbWVudElkJ30pO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBzbmlwcGV0c0RCLm9uZXJyb3I7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBpbnNlcnQ6IGZ1bmN0aW9uKGFycmFuZ2VtZW50LCBzY29yZSkge1xuICAgICAgICAgICAgICAgIGlmICghc25pcHBldHNEQi5pblByb2dyZXNzW2FycmFuZ2VtZW50Ll9pZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRiID0gc25pcHBldHNEQi5kYjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRyYW5zID0gZGIudHJhbnNhY3Rpb24oWydzbmlwcGV0cyddLCAncmVhZHdyaXRlJyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdG9yZSA9IHRyYW5zLm9iamVjdFN0b3JlKCdzbmlwcGV0cycpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgc25pcHBldHNEQi5pblByb2dyZXNzW2FycmFuZ2VtZW50Ll9pZF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVxdWVzdCA9IHN0b3JlLnB1dCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJhbmdlbWVudElkOiBhcnJhbmdlbWVudC5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29yZTogc2NvcmUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IChuZXcgRGF0ZSgpKS50b0lTT1N0cmluZygpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmUtcmVuZGVyIGFsbCB0aGUgdG9kbydzXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgc25pcHBldHNEQi5pblByb2dyZXNzW2FycmFuZ2VtZW50Ll9pZF07XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0QnlJZDogZnVuY3Rpb24oaWQsIHN1Y2Nlc3MsIGZhaWx1cmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGIgPSBzbmlwcGV0c0RCLmRiO1xuICAgICAgICAgICAgICAgIHZhciB0cmFucyA9IGRiLnRyYW5zYWN0aW9uKFsnc25pcHBldHMnXSwgJ3JlYWR3cml0ZScpO1xuICAgICAgICAgICAgICAgIHZhciBzdG9yZSA9IHRyYW5zLm9iamVjdFN0b3JlKCdzbmlwcGV0cycpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBzdG9yZS5nZXQoaWQpO1xuICAgICAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZhaWx1cmU7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmFpbHVyZShyZXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgaW5Qcm9ncmVzczoge31cbiAgICAgICAgfTtcblxuICAgIGlmIChpbmRleGVkREIpIHtcbiAgICAgICAgc25pcHBldHNEQi5vcGVuKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY2FjaGVTY29yZTogZnVuY3Rpb24gKGFycmFuZ2VtZW50LCBzY29yZSkge1xuICAgICAgICAgICAgc25pcHBldHNEQi5pbnNlcnQoYXJyYW5nZW1lbnQsIHNjb3JlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Q2FjaGVkU2NvcmU6IGZ1bmN0aW9uIChhcnJhbmdlbWVudCwgZXhpc3RzQ2FsbGJhY2ssIG5vdEV4aXN0c0NhbGxiYWNrKSB7XG4gICAgICAgICAgICBzbmlwcGV0c0RCLmdldEJ5SWQoYXJyYW5nZW1lbnQuX2lkLCBleGlzdHNDYWxsYmFjaywgbm90RXhpc3RzQ2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgfTtcbn0pOyIsInZhciBhbmd1bGFyID0gcmVxdWlyZSgnYW5ndWxhcicpLFxuICAgIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxuLy8gcmVxdWlyZSgnc3JjL3R1bmUvc2VydmljZXMvYWJjLXBhcnNlcicpO1xuXG5yZXF1aXJlKCdhbmd1bGFyJykubW9kdWxlKCdqbnIudHVuZScpLmZhY3RvcnkoJ2pUdW5lJywgZnVuY3Rpb24oXG4gICAgJHJvdXRlUGFyYW1zLFxuICAgICRyb290U2NvcGUsXG4gICAgakRhdGFiYXNlXG4pIHtcblxuICAgIHZhciBkYXlMZW5ndGggPSAoMTAwMCAqIDYwICogNjAgKiAyNCk7XG5cbiAgICB2YXIgVHVuZSA9IGZ1bmN0aW9uKHR1bmUsIG9wdHMpIHtcbiAgICAgICAgdGhpcy50dW5lID0gdHVuZTtcbiAgICAgICAgdGhpcy5vcHRzID0gb3B0cyB8fCB7fTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIFR1bmUuZXh0cmFjdCA9IGZ1bmN0aW9uKHR1bmUsIG9wdHMsIGluc3RhbmNlT3B0cykge1xuICAgICAgICB2YXIgalR1bmVzID0gW10sXG4gICAgICAgICAgICBmaWx0ZXI7XG5cbiAgICAgICAgb3B0cyA9IG9wdHMgfHwge307XG4gICAgICAgIGluc3RhbmNlT3B0cyA9IGluc3RhbmNlT3B0cyB8fCB7fTtcblxuICAgICAgICBpZiAob3B0cy5wZXJmb3JtYW5jZUZpbHRlcikge1xuICAgICAgICAgICAgalR1bmVzID0gXy5maWx0ZXIodHVuZS5wZXJmb3JtYW5jZXMsIG9wdHMucGVyZm9ybWFuY2VGaWx0ZXIpLm1hcChmdW5jdGlvbihwZXJmb3JtYW5jZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVHVuZSh0dW5lLCBhbmd1bGFyLmV4dGVuZCh7fSwgaW5zdGFuY2VPcHRzLCB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmZvcm1hbmNlOiBwZXJmb3JtYW5jZVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFqVHVuZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBqVHVuZXMgPSBbbmV3IFR1bmUodHVuZSwgYW5ndWxhci5leHRlbmQoe30sIGluc3RhbmNlT3B0cykpXTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgaWYgKG9wdHMubGlzdCkge1xuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkob3B0cy5saXN0LCBqVHVuZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGpUdW5lcztcblxuICAgIH07XG5cbiAgICBUdW5lLmNyZWF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICBpZiAoIShcbiAgICAgICAgICAgIGRhdGEubmFtZSAmJlxuICAgICAgICAgICAgZGF0YS5hYmMgJiZcbiAgICAgICAgICAgIGRhdGEucm9vdCAmJlxuICAgICAgICAgICAgZGF0YS5tZXRlciAmJlxuICAgICAgICAgICAgZGF0YS5tb2RlICYmXG4gICAgICAgICAgICBkYXRhLnJoeXRobVxuICAgICAgICApKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcGVyZm9ybWFuY2UsXG4gICAgICAgICAgICBuZXdUdW5lID0ge1xuICAgICAgICAgICAgICAgIHNlc3Npb25JZDogMCxcbiAgICAgICAgICAgICAgICBuYW1lOiBkYXRhLm5hbWUsXG4gICAgICAgICAgICAgICAgYXJyYW5nZW1lbnRzOiBbe1xuICAgICAgICAgICAgICAgICAgICBhYmM6IGRhdGEuYWJjLFxuICAgICAgICAgICAgICAgICAgICBoaWdoZXN0Tm90ZTogJycsXG4gICAgICAgICAgICAgICAgICAgIGxvd2VzdE5vdGU6ICcnLFxuICAgICAgICAgICAgICAgICAgICB2YXJpYW50czogJycsXG4gICAgICAgICAgICAgICAgICAgIHJvb3Q6IGRhdGEucm9vdCxcbiAgICAgICAgICAgICAgICAgICAgYXV0aG9yOiBkYXRhLmF1dGhvciB8fCAnd2hlcmVzcmh5cycsXG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgYWx0ZXJuYXRpdmVOYW1lczogW10sXG4gICAgICAgICAgICAgICAgbWV0ZXI6IGRhdGEubWV0ZXIsXG4gICAgICAgICAgICAgICAgbW9kZTogZGF0YS5tb2RlLFxuICAgICAgICAgICAgICAgIHJoeXRobTogZGF0YS5yaHl0aG0sXG4gICAgICAgICAgICAgICAgcmF0aW5nOiBkYXRhLnJhdGluZyB8fCAtMSxcbiAgICAgICAgICAgICAgICBwb3B1bGFyaXR5OiBkYXRhLnBvcHVsYXJpdHkgfHwgLTEsXG4gICAgICAgICAgICAgICAgcGVyZm9ybWFuY2VzOiBbXSxcbiAgICAgICAgICAgICAgICBub3RlczogZGF0YS5ub3Rlc1xuICAgICAgICAgICAgfTtcblxuICAgICAgICBpZiAoZGF0YS5wZXJmb3JtYW5jZS5pbnN0cnVtZW50KSB7XG4gICAgICAgICAgICBwZXJmb3JtYW5jZSA9IHtcbiAgICAgICAgICAgICAgICBzdGFuZGFyZDogZGF0YS5wZXJmb3JtYW5jZS5zdGFuZGFyZCB8fCAwLFxuICAgICAgICAgICAgICAgIG5vdGVzOiAnJyxcbiAgICAgICAgICAgICAgICBiZXN0OiBkYXRhLnBlcmZvcm1hbmNlLnN0YW5kYXJkIHx8IDAsXG4gICAgICAgICAgICAgICAgZGlmZmljdWx0eTogZGF0YS5wZXJmb3JtYW5jZS5kaWZmaWN1bHR5IHx8ICgtMSksXG4gICAgICAgICAgICAgICAgbGFzdFByYWN0aWNlZDogZGF0YS5wZXJmb3JtYW5jZS5zdGFuZGFyZCA/IG5ldyBEYXRlKCkgOiBuZXcgRGF0ZSgwKSxcbiAgICAgICAgICAgICAgICBzcGVjaWFsOiAhISBkYXRhLnBlcmZvcm1hbmNlLnNwZWNpYWwsXG4gICAgICAgICAgICAgICAgaW5zdHJ1bWVudDogZGF0YS5wZXJmb3JtYW5jZS5pbnN0cnVtZW50XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgakRhdGFiYXNlLmdldFJlc291cmNlKCd0dW5lcycpLnNhdmUobmV3VHVuZSwgZnVuY3Rpb24odHVuZSkge1xuICAgICAgICAgICAgaWYgKHBlcmZvcm1hbmNlKSB7XG4gICAgICAgICAgICAgICAgcGVyZm9ybWFuY2UuYXJyYW5nZW1lbnQgPSB0dW5lLmFycmFuZ2VtZW50c1swXS5faWQ7XG4gICAgICAgICAgICAgICAgcGVyZm9ybWFuY2UudHVuZSA9IHR1bmUuX2lkO1xuICAgICAgICAgICAgICAgIHR1bmUucGVyZm9ybWFuY2VzLnB1c2gocGVyZm9ybWFuY2UpO1xuICAgICAgICAgICAgICAgIHR1bmUuJHVwZGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgakRhdGFiYXNlLmdldFRhYmxlKCd0dW5lcycpLnB1c2godHVuZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBUdW5lLmdldEZvckFycmFuZ2VtZW50ID0gZnVuY3Rpb24oYXJyYW5nZW1lbnQsIGluc3RydW1lbnQpIHtcbiAgICAgICAgdmFyIHR1bmVzVGFibGUgPSBqRGF0YWJhc2UuZ2V0VGFibGUoJ3R1bmVzJyk7XG4gICAgICAgIHZhciB0dW5lID0gXy5maW5kV2hlcmUodHVuZXNUYWJsZSwge1xuICAgICAgICAgICAgX2lkOiBhcnJhbmdlbWVudC50dW5lXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBuZXcgVHVuZSh0dW5lLCB7XG4gICAgICAgICAgICBwZXJmb3JtYW5jZTogXy5maW5kV2hlcmUodHVuZS5wZXJmb3JtYW5jZXMsIHtcbiAgICAgICAgICAgICAgICBhcnJhbmdlbWVudDogYXJyYW5nZW1lbnQuX2lkLFxuICAgICAgICAgICAgICAgIGluc3RydW1lbnQ6IGluc3RydW1lbnRcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBUdW5lLnByb3RvdHlwZSA9IHtcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBpZiAodGhpcy5vcHRzLnNjb3BlKSB7XG4gICAgICAgICAgICAvLyAgICAgLy8gaWYgKHR5cGVvZiB0aGlzLm9wdHMuc2NvcGUgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgLy8gICAgIC8vICAgICAkc2NvcGUudHVuZSA9IHRoaXM7XG4gICAgICAgICAgICAvLyAgICAgLy8gICAgIHRoaXMuJHNjb3BlID0gJHNjb3BlO1xuICAgICAgICAgICAgLy8gICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAgICAgdGhpcy5zY29wZSA9IHRoaXMub3B0cy5zY29wZTtcbiAgICAgICAgICAgIC8vICAgICB0aGlzLnNjb3BlLnR1bmUgPSB0aGlzO1xuICAgICAgICAgICAgLy8gICAgIC8vIH0gIFxuICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICB0aGlzLl9hc3NpZ25BcnJBbmRQZXJmKCk7XG4gICAgICAgICAgICB0aGlzLl9zZXRMYXN0UHJhY3RpY2VkRGF5cygpO1xuICAgICAgICAgICAgdGhpcy5vcHRzLm1vZGlmaWVyICYmIHRoaXMub3B0cy5tb2RpZmllcih0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgX2Fzc2lnbkFyckFuZFBlcmY6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGRlZmF1bHRBcnJhbmdlbWVudCA9IHRoaXMudHVuZS5hcnJhbmdlbWVudHNbMF07XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRzLnBlcmZvcm1hbmNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wZXJmb3JtYW5jZSA9IHRoaXMub3B0cy5wZXJmb3JtYW5jZTtcbiAgICAgICAgICAgICAgICB0aGlzLmFycmFuZ2VtZW50ID0gXy5maW5kKHRoaXMudHVuZS5hcnJhbmdlbWVudHMsIGZ1bmN0aW9uKGFycmFuZ2VtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcnJhbmdlbWVudC5faWQgPT09IHRoYXQucGVyZm9ybWFuY2UuYXJyYW5nZW1lbnQ7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucGVyZm9ybWFuY2UgPSB7XG4gICAgICAgICAgICAgICAgICAgIGR1bW15OiB0cnVlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0aGlzLmFycmFuZ2VtZW50ID0gZGVmYXVsdEFycmFuZ2VtZW50O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlU2NvcmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zY29yZUdlbmVyYXRvciA9IHtcbiAgICAgICAgICAgICAgICBhcnJhbmdlbWVudDogdGhpcy5hcnJhbmdlbWVudCxcbiAgICAgICAgICAgICAgICBtZXRlcjogdGhpcy50dW5lLm1ldGVyLFxuICAgICAgICAgICAgICAgIG1vZGU6IHRoaXMudHVuZS5tb2RlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIF9zZXRMYXN0UHJhY3RpY2VkRGF5czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gKChuZXcgRGF0ZSgpKSAtIChuZXcgRGF0ZSh0aGlzLnBlcmZvcm1hbmNlLmxhc3RQcmFjdGljZWQgfHwgMCkpKTtcbiAgICAgICAgICAgIHRoaXMuZGF5c1NpbmNlTGFzdFByYWN0aWNlID0gK01hdGgucm91bmQoKG1pbGxpc2Vjb25kcyAvIGRheUxlbmd0aCksIDApO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9wZXJmb3JtYW5jZU5lZWRzU2F2aW5nOiBmdW5jdGlvbihwZXJmb3JtYW5jZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZHVtbXlTdGFuZGFyZCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcGVyZm9ybWFuY2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoWydpbnN0cnVtZW50JywgJ2R1bW15J10uaW5kZXhPZihrZXkpID09PSAtMSAmJiBwZXJmb3JtYW5jZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgX3BlcmZvcm1hbmNlSXNSZWFsOiBmdW5jdGlvbihwZXJmb3JtYW5jZSkge1xuICAgICAgICAgICAgcmV0dXJuICFwZXJmb3JtYW5jZS5kdW1teTtcbiAgICAgICAgfSxcblxuICAgICAgICBfY3JlYXRlUGVyZm9ybWFuY2U6IGZ1bmN0aW9uKHBlcmZvcm1hbmNlKSB7XG4gICAgICAgICAgICBwZXJmb3JtYW5jZSA9IHBlcmZvcm1hbmNlIHx8IHt9O1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0dW5lOiB0aGlzLnR1bmUuX2lkLFxuICAgICAgICAgICAgICAgIGluc3RydW1lbnQ6IChwZXJmb3JtYW5jZSAmJiBwZXJmb3JtYW5jZS5pbnN0cnVtZW50KSB8fCAkcm9vdFNjb3BlLnBhZ2VTdGF0ZS5pbnN0cnVtZW50LFxuICAgICAgICAgICAgICAgIHNwZWNpYWw6IHBlcmZvcm1hbmNlLnNwZWNpYWwgfHwgZmFsc2UsXG4gICAgICAgICAgICAgICAgbGFzdFByYWN0aWNlZDogbmV3IERhdGUoMCksXG4gICAgICAgICAgICAgICAgZGlmZmljdWx0eTogcGVyZm9ybWFuY2UuZGlmZmljdWx0eSB8fCAtMSxcbiAgICAgICAgICAgICAgICBiZXN0OiAwLFxuICAgICAgICAgICAgICAgIG5vdGVzOiAnJyxcbiAgICAgICAgICAgICAgICBzdGFuZGFyZDogMCxcbiAgICAgICAgICAgICAgICBhcnJhbmdlbWVudDogdGhpcy5hcnJhbmdlbWVudC5faWRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3VwZGF0ZVBlcmZvcm1hbmNlOiBmdW5jdGlvbihvcHRzKSB7XG5cbiAgICAgICAgICAgIHZhciBwcmFjdGljZWQgPSBmYWxzZSxcbiAgICAgICAgICAgICAgICBwZXJmb3JtYW5jZSA9IG9wdHMucGVyZm9ybWFuY2UgfHwgdGhpcy5wZXJmb3JtYW5jZTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9wZXJmb3JtYW5jZU5lZWRzU2F2aW5nKHBlcmZvcm1hbmNlKSkge1xuXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9wZXJmb3JtYW5jZUlzUmVhbChwZXJmb3JtYW5jZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcGVyZm9ybWFuY2UgPSB0aGlzLl9jcmVhdGVQZXJmb3JtYW5jZShwZXJmb3JtYW5jZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHVuZS5wZXJmb3JtYW5jZXMucHVzaChwZXJmb3JtYW5jZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZHVtbXlTdGFuZGFyZCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmR1bW15U3RhbmRhcmQgPiAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJmb3JtYW5jZS5zcGVjaWFsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcGVyZm9ybWFuY2Uuc3RhbmRhcmQgPSB0aGlzLmR1bW15U3RhbmRhcmQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHVtbXlTdGFuZGFyZCA9IC0xO1xuICAgICAgICAgICAgICAgICAgICBwZXJmb3JtYW5jZS5sYXN0UHJhY3RpY2VkID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0TGFzdFByYWN0aWNlZERheXMoKTtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd0dW5lUHJhY3RpY2VkJywgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHByYWN0aWNlZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGVyZm9ybWFuY2UuYmVzdCA9IE1hdGgubWF4KHBlcmZvcm1hbmNlLmJlc3QsIHBlcmZvcm1hbmNlLnN0YW5kYXJkKTtcblxuICAgICAgICAgICAgICAgIGlmIChvcHRzLnNldFB1YmxpY1BlcmZvcm1hbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGVyZm9ybWFuY2UgPSBwZXJmb3JtYW5jZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwcmFjdGljZWQ7XG4gICAgICAgIH0sXG4gICAgICAgIGlzTmV3OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnR1bmUucmF0aW5nIDwgMDsgLy8gfHwgdHVuZS5wb3B1bGFyaXR5IDwgMDtcbiAgICAgICAgfSxcbiAgICAgICAgcmVzZXRBcnJhbmdlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGVzdElkID0gdGhpcy5wZXJmb3JtYW5jZS5hcnJhbmdlbWVudDtcbiAgICAgICAgICAgIHRoaXMuYXJyYW5nZW1lbnQgPSBfLmZpbmQodGhpcy50dW5lLmFycmFuZ2VtZW50cywgZnVuY3Rpb24oYXJyYW5nZW1lbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyYW5nZW1lbnQuX2lkID09PSB0ZXN0SWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuYXJyYW5nZW1lbnRDaGFuZ2VQZW5kaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbmV4dEFycmFuZ2VtZW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuYXJyYW5nZW1lbnQgPSB0aGlzLnR1bmUuYXJyYW5nZW1lbnRzWyh0aGlzLnR1bmUuYXJyYW5nZW1lbnRzLmluZGV4T2YodGhpcy5hcnJhbmdlbWVudCkgKyAxKSAlIHRoaXMudHVuZS5hcnJhbmdlbWVudHMubGVuZ3RoXTtcbiAgICAgICAgICAgIHRoaXMuYXJyYW5nZW1lbnRDaGFuZ2VQZW5kaW5nID0gKHRoaXMuYXJyYW5nZW1lbnQuX2lkICE9PSB0aGlzLnBlcmZvcm1hbmNlLmFycmFuZ2VtZW50KTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2NvcmUoKTtcbiAgICAgICAgfSxcblxuICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKG9wdHMpIHtcbiAgICAgICAgICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuXG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgb2xkUHJvcHMgPSBvcHRzLm9sZFByb3BzIHx8IHt9LFxuICAgICAgICAgICAgICAgIHByYWN0aWNlZCA9IHRoaXMuX3VwZGF0ZVBlcmZvcm1hbmNlKG9wdHMpO1xuXG4gICAgICAgICAgICBpZiAob2xkUHJvcHMgJiYgb2xkUHJvcHMucmF0aW5nID09PSAtMSAmJiAhdGhpcy5pc05ldygpKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5uZXdUdW5lQ291bnQtLTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdHMuYXJyYW5nZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnR1bmUuYXJyYW5nZW1lbnRzLnB1c2gob3B0cy5hcnJhbmdlbWVudCk7XG4gICAgICAgICAgICAgICAgaWYgKG9wdHMuYXJyYW5nZW1lbnQuX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBvcHRzLmFycmFuZ2VtZW50Ll9pZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3B0cy5hcnJhbmdlbWVudC50dW5lID0gdGhpcy50dW5lLl9pZDtcbiAgICAgICAgICAgICAgICB0aGlzLl9zeW5jKGZ1bmN0aW9uKHNhdmVkVHVuZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy51c2VBcnJhbmdlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC51cGRhdGVTY29yZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5hcnJhbmdlbWVudCA9IHNhdmVkVHVuZS5hcnJhbmdlbWVudHNbc2F2ZWRUdW5lLmFycmFuZ2VtZW50cy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQucGVyZm9ybWFuY2UuYXJyYW5nZW1lbnQgPSB0aGF0LmFycmFuZ2VtZW50Ll9pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuX3N5bmMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuYXJyYW5nZW1lbnRDaGFuZ2VQZW5kaW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3luYygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3B0cy5hcnJhbmdlbWVudCB8fCBvcHRzLnVwZGF0ZVNjb3JlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVTY29yZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHByYWN0aWNlZDogcHJhY3RpY2VkXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG4gICAgICAgIF9zeW5jOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgICAgIHBlcmZvcm1hbmNlSW5kZXggPSB0aGlzLnR1bmUucGVyZm9ybWFuY2VzLmluZGV4T2YodGhpcy5wZXJmb3JtYW5jZSksXG4gICAgICAgICAgICAgICAgYXJyYW5nZW1lbnRJbmRleCA9IHRoaXMudHVuZS5hcnJhbmdlbWVudHMuaW5kZXhPZih0aGlzLmFycmFuZ2VtZW50KTtcblxuICAgICAgICAgICAgdGhpcy50dW5lLiR1cGRhdGUoZnVuY3Rpb24oc2F2ZWRUdW5lKSB7XG4gICAgICAgICAgICAgICAgdGhhdC5wZXJmb3JtYW5jZSA9IHRoYXQudHVuZS5wZXJmb3JtYW5jZXNbcGVyZm9ybWFuY2VJbmRleF07XG4gICAgICAgICAgICAgICAgdGhhdC5hcnJhbmdlbWVudCA9IHRoYXQudHVuZS5hcnJhbmdlbWVudHNbYXJyYW5nZW1lbnRJbmRleF07XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soc2F2ZWRUdW5lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgcmV0dXJuIFR1bmU7XG5cbn0pOyIsIid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnc3JjL3R1bmUvc2VydmljZXMvc2NvcmUtc25pcHBldHMnKTtcblxudmFyIEFCQ0pTID0gcmVxdWlyZSgnYWJjanMnKSxcbiAgICBzbmlwcGV0c1N0b3JlO1xuXG52YXIgU2NvcmVEcmF3ZXIgPSBmdW5jdGlvbiAoc2NvcmVHZW5lcmF0b3IsIHNuaXBwZXRPbmx5LCBlbCkge1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgICB0aGlzLnNjb3JlR2VuZXJhdG9yID0gc2NvcmVHZW5lcmF0b3I7XG4gICAgdGhpcy5zbmlwcGV0T25seSA9IHNuaXBwZXRPbmx5O1xuICAgIHRoaXMuZXhlYygpO1xufTtcblxuU2NvcmVEcmF3ZXIucHJvdG90eXBlID0ge1xuICAgIGV4ZWM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZWwuaHRtbCgnJyk7XG5cblxuICAgICAgICB0aGlzLmFycmFuZ2VtZW50ID0gdGhpcy5zY29yZUdlbmVyYXRvci5hcnJhbmdlbWVudDtcblxuICAgICAgICBpZiAoIXRoaXMuYXJyYW5nZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYWJjID0gdGhpcy5hcnJhbmdlbWVudC5hYmM7XG4gICAgICAgIHRoaXMuY29uZiA9IHtcbiAgICAgICAgICAgIHNjYWxlOiAwLjYsXG4gICAgICAgICAgICBwYWRkaW5ndG9wOiAwLFxuICAgICAgICAgICAgcGFkZGluZ2JvdHRvbTogMCxcbiAgICAgICAgICAgIHBhZGRpbmdyaWdodDogMCxcbiAgICAgICAgICAgIHBhZGRpbmdsZWZ0OiAwXG4gICAgICAgIH07XG5cbiAgICAgICAgXG5cbiAgICAgICAgaWYgKHRoaXMuc25pcHBldE9ubHkpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0U25pcHBldCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJTY29yZSgpO1xuICAgICAgICB9IFxuICAgIH0sXG5cbiAgICBnZXRTbmlwcGV0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICB0aGlzLmVsLmFkZENsYXNzKCdzY29yZS1zbmlwcGV0Jyk7XG5cbiAgICAgICAgc25pcHBldHNTdG9yZS5nZXRDYWNoZWRTY29yZSh0aGlzLmFycmFuZ2VtZW50LCBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICBzZWxmLmVsLmh0bWwob2JqLnNjb3JlKTtcbiAgICAgICAgICAgIHNlbGYuZWxbMF0uc3R5bGUud2lkdGggPSBzZWxmLmVsLmZpbmQoJ3N2ZycpWzBdLmdldEF0dHJpYnV0ZSgnd2lkdGgnKSArICdweCc7XG4gICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYuYWJjID0gc2VsZi5hYmMucmVwbGFjZSgvXlxcfCo6Py8sICcnKTtcbiAgICAgICAgICAgIHNlbGYuYWJjID0gc2VsZi5hYmMuc3BsaXQoJ3wnKTtcbiAgICAgICAgICAgIHNlbGYuYWJjID0gc2VsZi5hYmMuc2xpY2UoMCwgKHNlbGYuYWJjWzBdLmxlbmd0aCA8IDQgPyA0IDogMykpLmpvaW4oJ3wnKTtcbiAgICAgICAgICAgIHNlbGYuY29uZi5zY2FsZSA9IDAuNTtcbiAgICAgICAgICAgIHNlbGYuY29uZi5zdGFmZndpZHRoID0gNDUwO1xuICAgICAgICAgICAgc2VsZi5yZW5kZXJTY29yZSgpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgcmVuZGVyU2NvcmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmFiYyA9ICdYOjEnICtcbiAgICAgICAgLy8nXFxuVDonICsgc2NvcmVHZW5lcmF0b3IubmFtZSArIFxuICAgICAgICAnXFxuTTonICsgdGhpcy5zY29yZUdlbmVyYXRvci5tZXRlciArIFxuICAgICAgICAnXFxuTDoxLzgnICsgXG4gICAgICAgIC8vJ1xcblI6JyArIHNjb3JlR2VuZXJhdG9yLnJoeXRobSArIFxuICAgICAgICAnXFxuSzonICsgdGhpcy5hcnJhbmdlbWVudC5yb290ICsgdGhpcy5zY29yZUdlbmVyYXRvci5tb2RlICsgXG4gICAgICAgICdcXG4nICsgdGhpcy5hYmM7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBBQkNKUy5yZW5kZXJBYmMoc2VsZi5lbFswXSwgc2VsZi5hYmMsIHt9LCBzZWxmLmNvbmYsIHt9KTsgIFxuXG4gICAgICAgICAgICBpZiAoc2VsZi5zbmlwcGV0T25seSkge1xuICAgICAgICAgICAgICAgIHNuaXBwZXRzU3RvcmUuY2FjaGVTY29yZShzZWxmLmFycmFuZ2VtZW50LCBzZWxmLmVsWzBdLmlubmVySFRNTCk7XG4gICAgICAgICAgICB9ICBcbiAgICAgICAgfSwgMTAwKTsgICAgICAgIFxuICAgIH1cblxufTtcblxucmVxdWlyZSgnYW5ndWxhcicpLm1vZHVsZSgnam5yLnR1bmUnKS5kaXJlY3RpdmUoJ2pEcmF3U2NvcmUnLCBmdW5jdGlvbiAoalNjb3JlU25pcHBldHMpIHtcbiAgICBzbmlwcGV0c1N0b3JlID0galNjb3JlU25pcHBldHM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWwsIGF0dHJzKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBzbmlwcGV0T25seSA9ICEhYXR0cnMuc25pcHBldDtcblxuICAgICAgICAgICAgYXR0cnMuJG9ic2VydmUoJ3R1bmUnLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBuZXcgU2NvcmVEcmF3ZXIoSlNPTi5wYXJzZSh2YWx1ZSksIHNuaXBwZXRPbmx5LCBlbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5yZXF1aXJlKCdhbmd1bGFyJykubW9kdWxlKCdqbnIudHVuZScpLmRpcmVjdGl2ZSgnalBlcmZvcm1hbmNlUmF0ZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbG91cmluZ3MgPSAnZGVmYXVsdCxkYW5nZXIsd2FybmluZyxzdWNjZXNzLGluZm8scHJpbWFyeScuc3BsaXQoJywnKTtcbiAgICByZXR1cm4ge1xuICAgIC8vIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgICAgIHNjb3BlOiB0cnVlLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJy9zcmMvdHVuZS90cGwvcGVyZm9ybWFuY2UtcmF0ZXIuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIHZhciByYXRlZTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmF0ZWUgPSBKU09OLnBhcnNlKGF0dHJzLnJhdGVlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICByYXRlZSA9IHNjb3BlW2F0dHJzLnJhdGVlIHx8ICd0dW5lJ107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNjb3BlLnJhdGVlID0gcmF0ZWU7XG4gICAgICAgICAgICBzY29wZS5jb2xvdXJpbmdzID0gY29sb3VyaW5ncztcbiAgICAgICAgICAgIHNjb3BlLnVwZGF0ZVBlcmZvcm1hbmNlID0gZnVuY3Rpb24gKHJhdGluZykge1xuICAgICAgICAgICAgICAgIHJhdGVlLmR1bW15U3RhbmRhcmQgPSByYXRpbmc7XG4gICAgICAgICAgICAgICAgYXR0cnMuY2FsbGJhY2sgPyBzY29wZVthdHRycy5jYWxsYmFja10oKSA6IHJhdGVlLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygncGVyZm9ybWFuY2UtcmF0ZXInKTtcbiAgICAgICAgfVxuICAgIH07XG59KTtcbiIsInJlcXVpcmUoJ3NyYy90dW5lL3VpL3R1bmUtc3RhdC1zdW1tYXJ5Jyk7XG5cbnJlcXVpcmUoJ2FuZ3VsYXInKS5tb2R1bGUoJ2puci50dW5lJykuZGlyZWN0aXZlKCdqVHVuZUhlYWRpbmcnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAvLyB0cmFuc2NsdWRlOiB0cnVlLFxuICAgICAgICBzY29wZTogdHJ1ZSxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICcvc3JjL3R1bmUvdHBsL3R1bmUtaGVhZGluZy5odG1sJyxcbiAgICAgICAgY29tcGlsZTogZnVuY3Rpb24oZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHR1bmUgPSBzY29wZVthdHRycy50dW5lIHx8ICd0dW5lJ107XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgc2NvcGUudHVuZSA9IHR1bmUudHVuZTtcbiAgICAgICAgICAgICAgICBzY29wZS5hcnJhbmdlbWVudCA9IHR1bmUuYXJyYW5nZW1lbnQ7XG4gICAgICAgICAgICAgICAgaWYgKGF0dHJzLnN0YXRzKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnN0YXRzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygndHVuZS1oZWFkaW5nJyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCdzcmMvY29tbW9uL2RhdGEvZHJvcGRvd25zJyk7XG5cbiBcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoakRyb3Bkb3ducykge1xuICAgIHJldHVybiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICB2YXIgbWVzc2FnZSA9ICcnO1xuXG4gICAgICAgIGlmIChpbnB1dC5yYXRpbmcgIT09IC0xIHx8IGlucHV0LnBvcHVsYXJpdHkgIT09IC0xKSB7XG4gICAgICAgICAgICBtZXNzYWdlICs9ICdBICc7XG4gICAgICAgICAgICBpZiAoaW5wdXQucmF0aW5nICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UgKz0gakRyb3Bkb3ducy5yYXRpbmdbaW5wdXQucmF0aW5nIC0gMV0ubGFiZWwudG9Mb3dlckNhc2UoKSArICcgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbnB1dC5wb3B1bGFyaXR5ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UgKz0gakRyb3Bkb3ducy5wb3B1bGFyaXR5W2lucHV0LnBvcHVsYXJpdHldLmxhYmVsLnRvTG93ZXJDYXNlKCkgKyAnICc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZXNzYWdlICs9ICd0dW5lJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICB9O1xufTtcbiJdfQ==
