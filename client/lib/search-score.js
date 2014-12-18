'use strict';

var liquidMetal = require('liquidmetal');

module.exports = {
	sort: function (models, searchTerm, limit) {
		var scores = new WeakMap(models.map(function (model) {
			return [
				model,
				liquidMetal.score(model.get('name'), searchTerm)
			];
		}));


		return models.filter(function (model) {
			return scores.get(model) > 0.5;
		}).sort(function(model1, model2) {
			var score1 = scores.get(model1);
			var score2 = scores.get(model2);
			return score1 === score2 ? 0 :
						score1 > score2 ? -1: 1
		});

	}
};


// require('src/tune-lists/services/tune-list');
// require('src/tune/ui/tune-heading');
// require('src/tune/ui/performance-rater');
// require('src/common/ui/select-on-click');
// require('src/common/services/page-state');

//     var filters = {
//             practice: function (tune) {
//                 return tune.tune.performances.length && (!$routeParams.instrument || _.filter(tune.tune.performances, function (performance) {
//                     return performance.instrument === $routeParams.instrument && (performance.best > 2 || performance.special);
//                 }).length);
//             },
//             search: function (tune) {
//                 tune.searchScore = liquidMetal.score(tune.tune.name, $scope.searchTerm.replace(/\s/g, ''));
//                 return tune.searchScore > 0.3;
//             }
//         },
//         sorters = {
//             practice: function (tune) {
//                 var performance = tune.performance || tune._createPerformance(),
//                     gap = performance.best - performance.standard,
//                     difficulty = performance.difficulty === -1 ? 0 : performance.difficulty,
//                     rating = tune.tune.rating === -1 ? 0 : tune.tune.rating,
//                     popularity = tune.tune.popularity === -1 ? 0 : tune.tune.popularity,
//                     practiceUrgency = 0,
//                     uniqueVersion = tune.tune.performances.length < 2,
//                     tuneRank = (performance.special * 5) + (1.5 * rating) + popularity + uniqueVersion;

//                 if (performance.best > 2 || performance.special) {
//                     practiceUrgency = (gap + (difficulty / 2) + 1);
//                     if (performance.standard < 3) {
//                         practiceUrgency += gap;
//                     }
//                     if (performance.special && performance.best < 3 ) {
//                         practiceUrgency += 2;
//                     }
//                 } else {
//                     practiceUrgency = (gap - (difficulty / 2) + 1);
//                 }
//                 tune.practiceRank = tuneRank * practiceUrgency * (tune.daysSinceLastPractice + 1);
//                 return -tune.practiceRank;
//             },
//             search: function (tune) {
//                 return -tune.searchScore;
//             }
//         },
//         getFilter = function (filterTerm) {
//             var modeTerm = $scope.filterMode.trim(),
//                 rhythmTerm = $scope.filterRhythm.trim();

//             var allTuneRhythms = $rootScope.dropdowns.rhythm,
//                 rhythms = {
//                     included: [],
//                     excluded: []
//                 };

//             if (rhythmTerm) {
//                 rhythmTerm = rhythmTerm.split('|');
//                 for (var key in allTuneRhythms) {
//                     if (rhythmTerm.indexOf(allTuneRhythms[key]) > -1) {
//                         rhythms.included.push(allTuneRhythms[key]);
//                     }
//                     if (rhythmTerm.indexOf('!' + allTuneRhythms[key]) > -1) {
//                         rhythms.excluded.push(allTuneRhythms[key]);
//                     }
//                 }
//             }

//             if (modeTerm && /^(\!?([ABCDEFG](#|b)?)?([a-z]{3})?(\|)?)+$/.test(modeTerm)) {
//                 var modes = [],
//                     mode,
//                     modeMatchers = {
//                         and: [],
//                         or: []
//                     };
//                 // modeTerm = modeTerm.replace(/\([^(]+\)/g, function ($1) {
//                 //     modes.push($1.substr(1, $1.length - 2));
//                 //     return '';
//                 // });

//                 modes = modes.concat(modeTerm);

//                 for (mode in modes) {
//                     getSingleModeFilter(modes[mode], modeMatchers);
//                 }
//                 // filter by e.g G|aeo Dmaj, mix|maj. case sensitive, !G (not automatically becomes an and)

//             }

//             return function (tune) {
//                 if (rhythmTerm) {
//                     if ((rhythms.included.length && rhythms.included.indexOf(tune.tune.rhythm) === -1) || (rhythms.excluded.length && rhythms.excluded.indexOf(tune.tune.rhythm) > -1)) {
//                         return false;
//                     }

//                 }

//                 if (modeMatchers) {
//                     return runMatchers(tune, modeMatchers);
//                 }

//                 return true;
//             };

//         },

//         getSingleModeFilter = function (mode, matchers) {
//             // if (!mode) {
//             //     return;
//             // }
//             var statements;
//             // if (mode.indexOf('|!') > -1) {
//             //     statements = mode.split('|!');
//             //     statements.map(function (item, index) {
//             //         getSingleModeFilter(index !== 0 ? '!' : '' + item, matchers);
//             //     });
//             //     return;
//             // }
//             if (/[a-z]\|[A-Z]/.test(mode)) {
//                 (function () {
//                     var statements = mode.split('|'),
//                         i,
//                         il,
//                         statement = '';

//                     for (i = 0, il = statements.length; i<il; i++) {
//                         if (!statement) {
//                             statement = statements[i];
//                         } else {
//                             /* istanbul ignore else: other code prevents it ever running */
//                             if (/[a-z]/.test(statement.charAt(statement.length - 1)) && /[A-Z]/.test(statements[i].charAt(0))) {
//                                 getSingleModeFilter(statement, matchers);
//                             }
//                             statement = statements[i];
//                         }
//                     }
//                     getSingleModeFilter(statement, matchers);


//                 }());
//                 return;
//             }
//             var roots = mode.match(/[A-Z]/g),
//                 modes = mode.match(/[a-z]{3}/g),
//                 negated = mode.indexOf('!') === 0;

//             var matcher = function (tune) {
//                 var matches = true;
//                 if (roots) {
//                     matches = matches && roots.indexOf(tune.arrangement.root) > -1;
//                 }
//                 if (modes) {
//                     matches = matches && modes.indexOf(tune.tune.mode) > -1;
//                 }

//                 return negated ? !matches : matches;
//             };

//             matchers[negated ? 'and' : 'or'].push(matcher);
//         },

//         runMatchers = function (tune, matchers) {
//             var matcher,
//                 result = false;
//             if (matchers.or.length) {
//                 for (matcher in matchers.or) {
//                     if (matchers.or[matcher](tune)) {
//                         result = true;
//                         break;
//                     }
//                 }
//             } else {
//                 result = true;
//             }

//             if (matchers.and.length) {
//                 for (matcher in matchers.and) {
//                     if (!matchers.and[matcher](tune)) {
//                         return false;
//                     }
//                 }
//             }

//             return result;
//         };

//     function updateCounts () {
//         if ($scope.searchTerm) {return;}
//         var allTunes = Array.prototype.concat.apply(tuneList.selectedTunes, tuneList.otherTunes);
//         $scope.counts = [
//             allTunes.length,
//             {
//                 now: _.filter(allTunes, function (tune) {
//                     return tune.performance.standard === 1;
//                 }).length,
//                 past: _.filter(allTunes, function (tune) {
//                     return tune.performance.best === 1;
//                 }).length
//             },
//             {
//                 now: _.filter(allTunes, function (tune) {
//                     return tune.performance.standard === 2;
//                 }).length,
//                 past: _.filter(allTunes, function (tune) {
//                     return tune.performance.best === 2;
//                 }).length
//             },
//             {
//                 now: _.filter(allTunes, function (tune) {
//                     return tune.performance.standard === 3;
//                 }).length,
//                 past: _.filter(allTunes, function (tune) {
//                     return tune.performance.best === 3;
//                 }).length
//             },
//             {
//                 now: _.filter(allTunes, function (tune) {
//                     return tune.performance.standard === 4;
//                 }).length,
//                 past: _.filter(allTunes, function (tune) {
//                     return tune.performance.best === 4;
//                 }).length
//             },
//             {
//                 now: _.filter(allTunes, function (tune) {
//                     return tune.performance.standard === 5;
//                 }).length,
//                 past: _.filter(allTunes, function (tune) {
//                     return tune.performance.best === 5;
//                 }).length
//             }
//         ];

//         $scope.counts.toScratch = {
//             now: _.filter(allTunes, function (tune) {
//                 return tune.performance.standard > 2;
//             }).length,
//             past: _.filter(allTunes, function (tune) {
//                 return tune.performance.best > 2;
//             }).length
//         };
//     }

//     $scope.update = function () {
//         // if (this.tune.dummyStandard > -1) {
//         //     tuneList.moveToBottom(this.tune);
//         // }

//         this.tune.update({
//             performance: this.tune.performance,
//             setPublicPerformance: true
//         });

//         //updateCounts();
//     };

//     $scope.searchTerm = '';
//     $scope.filterMode = '';
//     $scope.filterRhythm = '';
//     $scope.summaryCollapsed = true;
//     $rootScope.$on('tunePracticed', function (event, tune) {
//         tuneList.moveToBottom(tune);
//         updateCounts();

//     });

//     $scope.search = function () {
//         if ($scope.searchTerm.trim().length > 3) {
//             $scope.filterMode = '';
//             $scope.filterRhythm = '';
//             tuneList.relist({
//                 filter: filters.search,
//                 sort: sorters.search,
//                 forceRelist: true,
//                 limit: 0
//             });
//         } else {
//             tuneList.relist({
//                 filter: filters.practice,
//                 sort: sorters.practice,
//                 limit: 15
//             });
//         }
//     };

//     $scope.filter = function () {

//         if ($scope.filterMode.trim() || $scope.filterRhythm.trim()) {
//             $scope.searchTerm = '';
//             tuneList.relist({
//                 filter: getFilter(),
//                 sort: sorters.practice,
//                 forceRelist: true,
//                 limit: ($scope.filterRhythm.trim() && $scope.filterMode.trim()) ? 0 : 20
//             });
//         } else {
//             tuneList.relist({
//                 filter: filters.practice,
//                 sort: sorters.practice,
//                 limit: 15
//             });
//         }
//     };

//     $scope.filters = filters;
//     $scope.sorters = sorters;

//     jPageState.set({
//         section: 'tunes',
//         instrument: $routeParams.instrument,
//         path: '/tunes'
//     });

//     var tuneList = jTuneList({
//         $scope: $scope,
//         filter: filters.practice,
//         sort: sorters.practice,
//         tuneModifier: function (tune) {
//             tune.dummyStandard = -1;
//         }
//     });

//     try {
//         updateCounts();
//     } catch (e) {
//         $scope.$on('tunesListed', function (event, list) {

//             // if (list === tuneList) {
//             updateCounts();
//             // }
//         });
//     }
// };