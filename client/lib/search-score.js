'use strict';

var liquidMetal = require('liquidmetal');

var analyze = function (query) {
	var obj = {};
	obj.term = query
		.replace(/\b[kK]\:([ABCDEFG][#b]?)?(maj|mix|dor|min|aeo|\+|-)?(\s|$)/, function ($0, root, mode) {
			obj.key = {
				root: root,
				modes: mode === '+' ? ['maj', 'mix'] :
								mode === '-' ? ['dor', 'min', 'aeo'] :
								mode ? [mode] : undefined
			}
			return ' ';
		})
		.replace(/\b[rR]\:(reel|jig|slip jig|hornpipe|polka)\b/, function ($0, rhythm) {
			obj.rhythm = {
				rhythm: rhythm
			}
			return ' ';
		})
		.replace(/\b[kKrR]\:([^\s]+)?/g, function () {
			return ' ';
		})
		.trim()
		.replace(/\s+/, ' ')
	return obj;
};

var scoreForKey = function (model, keyCriteria) {
	if (!keyCriteria) {
		return 1;
	}
	return model.get('keys').some(function (key) {
		if (keyCriteria.modes) {
			var root = keyCriteria.root || '';
			return keyCriteria.modes.some(function (mode) {
				return key.indexOf(root + mode) > -1;
			});
		} else {
			return key.indexOf(keyCriteria.root) === 0;
		}
	}) ? 1 : 0;
}

var scoreForRhythm = function (model, rhythmCriteria) {
	if (!rhythmCriteria) {
		return 1;
	}
	return model.get('rhythms').some(function (rhythm) {
		return rhythmCriteria.rhythm.toLowerCase() === rhythm.toLowerCase();
	}) ? 1 : 0;
}

module.exports = {
	sort: function (models, criteria) {

		if (criteria.key || criteria.rhythm) {
			models = models.filter(function (model) {
				return scoreForKey(model, criteria.key) * scoreForRhythm(model, criteria.rhythm);
			});
		}

		var hash = {};
		models.forEach(function (model) {
			hash[model.id] = criteria.term ? liquidMetal.score(model.get('name'), criteria.term) : 1;
		});

		return models.sort(function(model1, model2) {
			var score1 = hash[model1.id];
			var score2 = hash[model2.id];
			return score1 === score2 ? 0 : score1 > score2 ? -1: 1
		}).map(function (model) {
			return model;
		});

	},
	analyzeTerm: analyze
};