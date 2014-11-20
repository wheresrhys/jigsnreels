var swig = require('swig/index');
var practiceView = require('../practice/view');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	
	events: {},

	initialize: function (practices, el) {
		this.practices = practices;
		this.parent = el;
		this.listenTo(this.practices, 'sync', this.render.bind(this));
		this.render();
	},

	render: function () {
		this.renderToDom(swig.render(this.tpl, this.practices.Presenter().toJSON(true)), true);
		var list = this.el.querySelector('.practice-list__list');

		this.practices.models.forEach(function (practice) {
			setTimeout(function () {
				new practiceView(practice, list).render();	
			});
		});

		return this;
	}
});