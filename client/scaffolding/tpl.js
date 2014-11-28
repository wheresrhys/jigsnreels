// keep an accurate enough reference to the current time;
var now = new Date();
var day = 1000 * 60 * 60 * 24;

setTimeout(function () {
    now = new Date();
}, 1000);

var swig = require('swig/index');

swig.setFilter('deTheify', function (input) {
    return input.replace(/^The /, function () {
        return '<span class="the">The </span>';
    })
});

swig.setFilter('daysAgo', function (input) {
    return Math.round(new Date(now - input).getTime() / day) + 'd';
});