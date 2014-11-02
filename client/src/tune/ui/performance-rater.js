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
