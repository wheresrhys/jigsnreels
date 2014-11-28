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
