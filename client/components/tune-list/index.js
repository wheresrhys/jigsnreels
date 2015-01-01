var TuneView = require('../tune');
var SearchView = require('../search');
var allTunes = require('../../data/collections/tunes');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	name: 'tune-list',
	events: {},
	initialize: function (opts) {
		this.parentEl = opts.parentEl;
		this.parent = opts.parent;
		this.limit = 20;
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
		this.listenTo(this.search, 'results', this.render);
		this.listenTo(this.search, 'invalid', this.render);
		this.render();
	},

	render: function (results) {
		var self = this;
		// don't rerender when we're applying no filter to an already unfiltered list
		if (!results && !this.filtered && this.listEl.innerHTML) {
			return;
		}
		this.filtered = !!results;
		this.listEl.innerHTML = '';
		var tunes = results || allTunes.models.sort(function (m1, m2) {
			var m1r = m1.get('rating');
			var m2r = m2.get('rating');
			return (m1r === m2r) ? 0 : (m1r > m2r) ? 1 : -1;
		}).slice(0, this.limit);
		tunes.forEach(function (model) {
			// setTimeout(function () {
			var tuneView = new TuneView(self.childOpts(self.listEl, {
				tune: model
			})).render();
			self.listenTo(tuneView, 'abc-open', self.enforceUniqueAbc);
			// });
		});

		return this;
	},



	enforceUniqueAbc: function (set) {
		this.abcViewer && this.abcViewer.destroy();
		this.abcViewer = set.abcViewer;
	},

});