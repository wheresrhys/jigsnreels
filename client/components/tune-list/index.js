var TuneView = require('../tune');
var SearchView = require('../search');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	name: 'tune-list',
	events: {},
	initialize: function (opts) {
		this.parentEl = opts.parentEl;
		this.parent = opts.parent;
		this.limit = opts.limit || 20;
		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		this.parent && this.listenTo(this.parent, 'destroy', this.destroy);
		this.staticRender();
	},

	staticRender: function () {
		this.renderToDom(this.swig.render(this.tpl), true);
		this.listEl = this.el.querySelector('.tune-list__list');
		this.search = new SearchView(this.childOpts('search', {
			limit: this.limit
		}));
		this.listenTo(this.search, 'results', this.render)
	},

	render: function (results) {
		this.listEl.innerHTML = '';
		var self = this;
		results.forEach(function (model) {
			// setTimeout(function () {
			var tuneView = new TuneView(self.childOpts(self.listEl, {
				tune: model
			})).render();
			// });
		});

		return this;
	}

});
