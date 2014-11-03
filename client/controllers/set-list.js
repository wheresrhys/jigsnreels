var app = require('../scaffolding/app');

module.exports = function () {
    app.sets.fetch();
    new require('components/set-list/view')(app.sets);
};