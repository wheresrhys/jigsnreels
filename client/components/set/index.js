var AbcViewer = require('../abc-viewer');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	name: 'set',
	events: {
		'click .set__edit-tunebooks': 'displayTunebookTogglers',
		'change .set__tunebook-toggle input[type="checkbox"]': 'toggleTunebook',
		'click .set__view-abc': 'viewAbc'
	},
	initialize: function (opts) {
		this.set = opts.set;
		this.parentEl = opts.parentEl;
		this.parent = opts.parent;
		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		this.listenTo(this.set, 'sync', this.render);
		this.listenTo(this.parent, 'destroy', this.destroy);
		this.render();
	},

	render: function () {
		this.renderToDom(this.swig.render(
			this.tpl,
			this.set.viewModel()
				.withTunebooks()
				.end(true)
		));
		return this;
	},
	destroy: function () {
		this.closeAbc();
		this.simpleDestroy();
	},
	displayTunebookTogglers: function () {
		this.el.querySelector('.set__tunebook-togglers').classList.toggle('active');
	},
	toggleTunebook: function (ev) {
		require('../../data/collections/pieces')
			.togglePiece(this.set.id, 'set', ev.delegateTarget.value, ev.delegateTarget.checked)
			.then(this.render);
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