module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	viewModel: require('../../data/view-models/set'),
	events: {
		'click .set__tunebook-adder': 'addToTunebook'
	},
	initialize: function (opts) {
		this.set = opts.set;
		this.parentEl = opts.parentEl;

		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		this.listenTo(this.set, 'sync', this.render);
		this.listenTo(opts.parentView, 'destroy', this.destroy);
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
	addToTunebook: function (ev) {
		require('../../data/collections/pieces')
			.getTunebook(ev.delegateTarget.dataset.tunebookName)
			.addPiece(this.set.id, 'set')
			.then(this.render);
	}

});