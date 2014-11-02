'use strict';
module.exports = function () {
    return function (scope, element, attrs) {
        element.bind('click', function () {
            element[0].select();
        });
    };
};
