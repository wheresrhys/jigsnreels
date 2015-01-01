var AbcViewer = require('../abc-viewer');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	name: 'tune',
	viewModel: require('../../data/view-models/tune'),
	events: {
		'click .tune__edit-tunebooks': 'displayTunebookTogglers',
		'change .tune__tunebook-toggle input[type="checkbox"]': 'toggleTunebook',
		'click .tune__view-abc': 'viewAbc'
	},
	initialize: function (opts) {
		this.tune = opts.tune;
		this.parentEl = opts.parentEl;
		this.parent = opts.parent;
		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		this.listenTo(this.tune, 'sync', this.render);
		this.listenTo(this.parent, 'destroy', this.destroy);
		this.render();
	},

	render: function () {
		this.renderToDom(this.swig.render(
			this.tpl,
			this.tune.viewModel()
				.withTunebooks()
				.end(true)
		));
		return this;
	},
	displayTunebookTogglers: function () {
		this.el.querySelector('.tune__tunebook-togglers').classList.toggle('active');
	},
	toggleTunebook: function (ev) {
		require('../../data/collections/pieces')
			.togglePiece(this.tune.id, 'tune', ev.delegateTarget.value, ev.delegateTarget.checked)
			.then(this.render);
	},
	destroy: function () {
		this.closeAbc();
		this.simpleDestroy();
	},
	viewAbc: function (ev) {
		this.abcViewer = new AbcViewer(this.childOpts('abc', {
			tuneId: ev.delegateTarget.dataset.tuneId,
			isDismissable: true
		}));
		this.trigger('abc-open', this);
	},
	closeAbc: function () {
		this.abcViewer && this.abcViewer.destroy();
		delete this.abcViewer;
	}

});