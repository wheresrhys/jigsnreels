'use strict';

var tunes = require('../collections/tunes');
var sets = require('../collections/sets');

var BB = require('exoskeleton');
module.exports = BB.Model.extend({
	idAttribute: '_id',
	url: function () {
		return require('../scaffolding/api').url('practices', this.id);
	},

	Presenter: require('./practice-presenter'),

	parse: function (resp) {
		if (resp.src) {
			if (resp.type === 'set') {
				sets = require('../collections/sets');
				sets.add(resp.src, {parse: true});    
			} else if (resp.type === 'tune') {
				tunes.add(resp.src, {parse: true});    
			}
		}
		delete resp.src
		return resp;
	},
	doPractice: function (type) {
		var score;
		var oldScore = this.get('lastPracticeQuality');
		if (type === 'good') {
			score = 1
		} else if (type === 'skip') {
			score = Math.min(this.get('lastPracticeQuality'), 0);
		} else {
			score = -1;
		}

		if (score + oldScore === -2) {
			this.set('stickiness', Math.min(this.get('stickiness') + 0.25, 3));
		} else if (score > 1){
			this.set('stickiness', this.get('stickiness') > 1 ? 1 : 0);
		} else {
			this.set('stickiness', Math.max(0, Math.min(this.get('stickiness') -0.5, 1)));
		}

		this.set('lastPracticeQuality', score);
		this.set('lastPracticed', new Date().toISOString());
		this.save();
	}
});