var TuneView = require('../tune');
var SearchView = require('../tune-search');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	events: {},
	initialize: function (opts) {
		this.allTunes = opts.tunes;
		this.parentEl = opts.parentEl;
		this.parent = opts.parent;
		this.limit = opts.limit || 20;
		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		this.staticRender();
	},

	staticRender: function () {
		this.renderToDom(this.swig.render(this.tpl), true);
		this.listEl = this.el.querySelector('.tune-list__list');
		this.search = new SearchView({
			parent: this,
			parentEl: this.el.querySelector('.tune-list__search'),
			tunes: this.allTunes
		});
		this.listenTo(this.search, 'results', this.render)
	},

	render: function (results) {
		this.listEl.innerHTML = '';
		var self = this;
		results.forEach(function (model) {
			// setTimeout(function () {
			var tuneView = new TuneView({
				tune: model,
				parentEl: self.listEl,
				parentView: self
			}).render();
			// });
		});

		return this;
	}

});
