'use strict';

var liquidMetal = require('liquidmetal');
var allTunes = require('../../data/collections/tunes');

var debounce = function (fn, debounceDuration, context){

    debounceDuration = debounceDuration || 100;

    return function(){
        if(!fn.debouncing){
            var args = Array.prototype.slice.apply(arguments);
            fn.lastReturnVal = fn.apply(context, args);
            fn.debouncing = true;
        }
        clearTimeout(fn.debounceTimeout);
        fn.debounceTimeout = setTimeout(function(){
            fn.debouncing = false;
        }, debounceDuration);

        return fn.lastReturnVal;
    };
};

var analyzeTerm = function (term) {
	var obj = {};
	obj.term = term
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

var TuneSearch = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	events: {
		'keyup input[type="search"]': 'search'
	},
	initialize: function (opts) {
		this.allTunes = opts.tunes || allTunes.models;
		this.parentEl = opts.parentEl;
		this.parent = opts.parent;
		this.limit = opts.limit || 20;
		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		this.search = debounce(this.search, 200, this);
		this.render();
	},

	render: function () {
		this.renderToDom(this.swig.render(this.tpl), true);
	},

	search: function (ev) {
		var criteria = analyzeTerm(ev.delegateTarget.value);
		if (criteria.term.length < 3 && !criteria.key && !criteria.rhythm)  {
			this.trigger('results', []);
		} else {
			this.trigger('results', this.getSortedResults(criteria).slice(0, this.limit));
		}
	},
	getSortedResults: function (criteria) {
		var tunes = this.allTunes;
		if (criteria.key || criteria.rhythm) {
			tunes = tunes.filter(function (model) {
				return scoreForKey(model, criteria.key) * scoreForRhythm(model, criteria.rhythm);
			});
		}

		var hash = {};
		tunes.forEach(function (model) {
			hash[model.id] = criteria.term ? liquidMetal.score(model.get('name'), criteria.term) : 1;
		});

		return tunes.filter(function (model) {
			return hash[model1.id] > 0;
		}).sort(function(model1, model2) {
			var score1 = hash[model1.id];
			var score2 = hash[model2.id];
			return score1 === score2 ? 0 : score1 > score2 ? -1: 1
		}).map(function (model) {
			return model;
		});

	},
	clear: function () {
		this.render();
	}

});

module.exports = TuneSearch;