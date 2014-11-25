var swig = require('swig/index');
module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	events: {},
	initialize: function (practice, el, parentView) {
		this.practice = practice;
		this.parent = el;
		this.listenTo(this.practice, 'sync', this.render.bind(this));
		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		
		this.listenTo(parentView, 'destroy', this.destroy);
		this.listenTo(practice, 'destroy', this.destroy);
		
		this.render();
	},

	render: function () {
		this.renderToDom(swig.render(this.tpl, this.practice.Presenter().toJSON(true)))
		return this;
	}
});