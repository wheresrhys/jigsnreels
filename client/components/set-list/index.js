module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	events: {},
	initialize: function (opts) {
		this.sets = opts.sets;
		this.parentEl = opts.parentEl;
		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		this.listenTo(this.sets, 'sync', this.render);
		this.render();
	},

	render: function () {
		this.renderToDom(this.swig.render(this.tpl, this.sets.Presenter().toJSON(true)), true);
	}
});