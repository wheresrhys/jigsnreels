'use strict';

module.exports = require('exoskeleton').Model.extend({
    idAttribute: '_id',
    url: function () {
        return require('../../scaffolding/api').url('tunes', this.id);
    },
    Presenter: require('./tune-presenter')
}, {});