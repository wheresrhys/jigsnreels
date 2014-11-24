'use strict';
var allTunes = require('../collections/tunes');
var practices = require('../collections/practices');

module.exports = require('exoskeleton').Model.extend({
    idAttribute: '_id',
    url: function () {
        return require('../scaffolding/api').url('sets', this.id);
    },

    Presenter: require('./set-presenter'),
    
    defaults: {
        tunes: [],
        keys: [],
        name: ''
    },

    parse: function (resp) {
        if (typeof resp.tunes[0] === 'object') {
            allTunes.add(resp.tunes, {parse: true});
            resp.tunes = resp.tunes.map(function (tune) {
                return tune._id;
            })
        }
        if (resp.practice) {
            practices = require('../collections/practices');
            practices.add(resp.practice, {parse: true});
            delete resp.practice;
        }
        return resp;
    },
    tuneNames: function () {
        return this.get('tunes').map(function (tuneId) {
            return allTunes.filter(function (tune) {
                return tune.get('_id') === tuneId;
            })[0].get('name');
        });
    },
    appendTune: function (tuneId) {
        var tune = allTunes.filter(function (tune) {
            return tune.get('_id') === tuneId;
        })[0];
        
        var tunes = this.get('tunes').length ? this.get('tunes') : [];
        var keys = this.get('keys').length ? this.get('keys') : [];

        tunes.push(tuneId);
        keys.push(tune.get('keys')[0]);
        this.set('tunes', tunes);
        this.set('keys', keys);
        this.trigger('change');
    },
    changeTuneKey: function (newKey, tuneId) {
        this.attributes.keys[this.get('tunes').indexOf(tuneId)] = newKey;
        this.trigger('change');
    }
}, {});