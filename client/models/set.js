'use strict';

var tunes = require('../collections/tunes');

module.exports = require('exoskeleton').Model.extend({
    
    Presenter: require('./set-presenter'),
    defaults: {
        tunes: []
    },
    appendTune: function (tuneId) {
        this.attributes.tunes.push(tunes.filter(function (tune) {
            return tune.get('_id') === tuneId;
        })[0]);
        this.trigger('change');
    }
}, {});