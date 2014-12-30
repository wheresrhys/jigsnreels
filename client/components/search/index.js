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
		.replace(/\b[kK]\:(?:([ABCDEFG][#b]?)?(maj|mix|dor|min|aeo|\+|-)?)(\s|$)/, function ($0, root, mode) {
			// as both root and mode are optional and 'either but not none' is hard to do in regex, doing it manually
			if (!root && !mode) {
				return $0;
			}
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

var getSubjects = function (tune) {
	return [tune];
}

var Search = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	name: 'search',
	events: {
		'keyup input[type="search"]': 'search'
	},
	initialize: function (opts) {
		this.allItems = opts.items || allTunes.models;
		this.getSubjects = opts.getSubjects || getSubjects;
		this.parentEl = opts.parentEl;
		this.parent = opts.parent;
		this.limit = opts.limit || 20;
		this.render = this.render.bind(this);
		this.filterItem = this.filterItem.bind(this);
		this.spreadItem = this.spreadItem.bind(this);
		this.scoreItem = this.scoreItem.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		this.search = debounce(this.search, 200, this);
		this.listenTo(this.parent, 'destroy', this.destroy);
		this.render();
	},

	render: function () {
		this.renderToDom(this.swig.render(this.tpl), true);
	},

	search: function (ev) {
		this.criteria = analyzeTerm(ev.delegateTarget.value);
		if (this.criteria.term.length < 3 && !this.criteria.key && !this.criteria.rhythm)  {
			this.trigger('invalid');
		} else {
			var results = this.getSortedResults();
			if (this.limit > 0) {
				results = results.slice(0, this.limit);
			}
			this.trigger('results', results);
		}
	},
	getSortedResults: function () {
		var items = this.allItems.map(this.spreadItem);

		if (this.criteria.key || this.criteria.rhythm) {
			items = items.filter(this.filterItem);
		}

		var hash = {};
		var self = this;
		if (this.criteria.term.length > 2) {
			items.forEach(this.scoreItem)

			items = items
				.filter(function (item) {
					return item.score > 0;
				})
				.sort(function(item1, item2) {
					return item1.score === item2.score ? 0 : item1.score > item2.score ? -1: 1
				});
		}

		return items.map(function (item) {
			return item.model;
		});

	},
	filterItem: function (item) {
		var key = this.criteria.key;
		var rhythm = this.criteria.rhythm;
		item.subjects = item.subjects.filter(function (model) {
			return scoreForKey(model, key) * scoreForRhythm(model, rhythm);
		});
		return !!item.subjects.length;
	},
	scoreItem: function (item) {
		var term = this.criteria.term;
		item.score = Math.max.apply(null, item.subjects.map(function (model) {
			return liquidMetal.score(model.get('name'), term);
		}));
	},
	spreadItem: function (model) {
		return {
			model: model,
			subjects: this.getSubjects(model)
		}
	},
	clear: function () {
		this.render();
	}

});

module.exports = Search;