var TuneView = require('../tune');
var SearchView = require('../search');
var tuneTpl = require('./tune.html');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	name: 'tune-picker',
	events: {
		'click .tune-picker__tune': 'selectTune'
	},
	initialize: function (opts) {
		this.parentEl = opts.parentEl;
		this.parent = opts.parent;
		this.limit = opts.limit || 20;
		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		this.staticRender();
	},

	staticRender: function () {
		this.renderToDom(this.swig.render(this.tpl), true);
		this.listEl = this.el.querySelector('.tune-picker__results');
		this.search = new SearchView(this.childOpts('search', {
			limit: 5
		}));
		this.listenTo(this.search, 'results', this.render)
		this.listenTo(this.search, 'invalid', this.render)
	},

	render: function (results) {
		this.listEl.innerHTML = '';
		if (!results) {
			return;
		}
		var html = '';
		var self = this;
		results.forEach(function (tune) {
			html += self.swig.render(tuneTpl, tune.viewModel().withTunebooks().end(true))
		});
		this.listEl.innerHTML = html;
		return this;
	},
	selectTune: function (ev) {
		this.trigger('tune-selected', ev.delegateTarget.dataset.tuneId);
		this.render([]);
		this.search.clear();
	}

});
