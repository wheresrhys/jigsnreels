module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	events: {
		'keyup input[type="search"]': 'search'
	},
	initialize: function (opts) {
		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
	},


	render: function () {
		this.renderToDom(this.swig.render(this.tpl))
		return this;
	},

	search: function (ev) {

	}

});