var searchScore = require('../../lib/search-score');
var TuneView = require('../tune');
var SearchView = require('../search');

var debounce = function (fn, debounceDuration){
    // summary:
    //      Returns a debounced function that will make sure the given
    //      function is not triggered too much.
    // fn: Function
    //      Function to debounce.
    // debounceDuration: Number
    //      OPTIONAL. The amount of time in milliseconds for which we
    //      will debounce the function. (defaults to 100ms)

    debounceDuration = debounceDuration || 100;

    return function(){
        if(!fn.debouncing){
            var args = Array.prototype.slice.apply(arguments);
            fn.lastReturnVal = fn.apply(window, args);
            fn.debouncing = true;
        }
        clearTimeout(fn.debounceTimeout);
        fn.debounceTimeout = setTimeout(function(){
            fn.debouncing = false;
        }, debounceDuration);

        return fn.lastReturnVal;
    };
};


module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	events: {
		'keyup input[type="search"]': 'search'
	},
	initialize: function (opts) {
		this.allTunes = opts.tunes;
		this.parentEl = opts.parentEl;
		this.parent = opts.parent;
		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		this.search = debounce(this.search.bind(this), 200);
		// this.search = new SearchView({
		// 	parent: this
		// });
		this.render();
	},

	render: function () {
		this.renderToDom(this.swig.render(this.tpl), true);
		this.listEl = this.el.querySelector('.tune-list__list');

		// this.search.parentEl = this.el.querySelector('.tune-list__search');
		// this.search.render();
	},
	populate: function () {
		this.listEl.innerHTML = '';
		var self = this;
		this.tunes.forEach(function (model) {
			// setTimeout(function () {
			var tuneView = new TuneView({
				tune: model,
				parentEl: self.listEl,
				parentView: self
			}).render();
			// });
		});

		return this;
	},
	search: function (ev) {
		var criteria = searchScore.analyzeTerm(ev.delegateTarget.value);
		if (criteria.term.length < 3 && !criteria.key && !criteria.rhythm)  {
			this.tunes = [];

		} else {
		// this.tunes = (term.indexOf(this.term) === 0) ? this.tunes : this.allTunes.models;
			this.tunes = searchScore.sort(this.allTunes.models, criteria).slice(0, 20);
		}
		this.populate();
	}

});
