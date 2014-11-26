var swig = require('swig/index');
module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	events: {
		'click .practice__good': 'doPractice',
		'click .practice__bad': 'doPractice',
		'click .practice__skip': 'doPractice'
	},
	initialize: function (practice, el, parentView) {
		this.practice = practice;
		this.parent = el;
		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		this.listenTo(this.practice, 'sync', this.render);
		this.listenTo(parentView, 'destroy', this.destroy);
		this.listenTo(practice, 'destroy', this.destroy);
		this.render();
	},

	render: function () {
		this.renderToDom(swig.render(this.tpl, this.practice.Presenter().toJSON(true)))
		return this;
	},
	doPractice: function (ev) {
		this.practice.doPractice(ev.delegateTarget.dataset.practiceType)
		this.destroy();
	}

});