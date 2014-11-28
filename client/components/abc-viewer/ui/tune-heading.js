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
