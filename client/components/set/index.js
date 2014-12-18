module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	name: 'set',
	events: {
		'click .set__tunebook-adder': 'addToTunebook'
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
	addToTunebook: function (ev) {
		require('../../data/collections/pieces')
			.addPiece(this.set.id, 'set', ev.delegateTarget.dataset.tunebookName)
			.then(this.render);
	}

});