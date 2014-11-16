'use strict';

var tunes = require('../collections/tunes');
var sets = require('../collections/sets');

var BB = require('exoskeleton');
module.exports = BB.Model.extend({
    url: function () {
        return require('../scaffolding/api').url('practices', this.id);
    },

    Presenter: require('./practice-presenter'),

    parse: function (resp) {
        if (resp.src) {
            if (resp.type === 'set') {
                sets.add(resp.src, {parse: true});    
            } else if (resp.type === 'tune') {
                tunes.add(resp.src, {parse: true});    
            }
        }
        delete resp.src
        return resp;
    }
}, {});