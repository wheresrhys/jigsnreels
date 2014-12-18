var searchScore = require('../../lib/search-score');
var TuneView = require('../tune');
var SearchView = require('../search');
module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	events: {
		'keyup input[type="search"]': 'search'
	},
	initialize: function (opts) {
		this.allTunes = opts.tunes;
		this.parentEl = opts.parentEl;
		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
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
			setTimeout(function () {
				var tuneView = new TuneView({
					tune: model,
					parentEl: self.listEl,
					parentView: self
				}).render();
			});
		});

		return this;
	},
	search: function (ev) {
		var term = ev.delegateTarget.value.trim();
		if (term.length < 3)  {
			this.listEl.innerHTML = '';
			return;
		}
		this.tunes = (term.indexOf(this.term) === 0) ? this.tunes : this.allTunes.models;
		this.tunes = searchScore.sort(this.tunes, term);
		this.term = term;
		this.populate();
	}

});