module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	events: {},
	initialize: function (opts) {
		this.parentEl = opts.parentEl;
		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);

		this.render();
	},

	render: function () {
		this.renderToDom(this.swig.render(this.tpl))
		return this;
	}

});