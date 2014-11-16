'use strict';

var tunes = require('../collections/tunes');

var BB = require('exoskeleton');
module.exports = BB.Model.extend({
    url: function () {
        return require('../scaffolding/api').url('sets', this.id);
    },

    Presenter: require('./set-presenter'),
    defaults: {
        tunes: [],
        keys: []
    },
    appendTune: function (tuneId) {
        var tune = tunes.filter(function (tune) {
            return tune.get('_id') === tuneId;
        })[0];
        this.attributes.tunes.push(tuneId);
        this.attributes.keys.push(tune.get('keys')[0]);
        this.trigger('change');
    },
    changeTuneKey: function (newKey, tuneId) {
        this.attributes.keys[this.get('tunes').indexOf(tuneId)] = newKey;
        this.trigger('change');
    }
}, {});