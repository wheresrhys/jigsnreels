module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	viewModel: require('../../data/view-models/tune'),
	events: {
		'click .tune__tunebook-adder': 'addToTunebook'
	},
	initialize: function (opts) {
		this.tune = opts.tune;
		this.parentEl = opts.parentEl;

		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		this.listenTo(this.tune, 'sync', this.render);
		this.listenTo(opts.parentView, 'destroy', this.destroy);
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
	destroy: function () {
		this.closeAbc();
		this.simpleDestroy();
	},
	addToTunebook: function (ev) {
		require('../../data/collections/pieces')
			.addPiece(this.tune.id, 'tune', ev.delegateTarget.datatune.tunebookName)
			.then(this.render);
	}

});