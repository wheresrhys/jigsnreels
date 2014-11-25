var swig = require('swig/index');


module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	events: {},
	initialize: function (sets, el) {
		this.sets = sets;
		this.parent = el;
		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		this.listenTo(this.sets, 'sync', this.render);
		this.render();
	},

	render: function () {
		this.renderToDom(swig.render(this.tpl, this.sets.Presenter().toJSON(true)), true);
	}
});