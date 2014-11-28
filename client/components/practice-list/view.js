var swig = require('swig/index');
var practiceView = require('../practice/view');
var practices = require('../../collections/practices');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	
	events: {},

	initialize: function (practicesPromise, el) {
		this.practices = practices;
		this.parent = el;
		this.length = 20;
		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		var self = this;
		practicesPromise.then(function (){
			self.listenTo(self.practices, 'practiced', self.append);
			self.render();
		});

	},

	render: function () {
		this.renderToDom(swig.render(this.tpl, this.practices.Presenter().toJSON(true)), true);
		this.listEl = this.el.querySelector('.practice-list__list');
		var self = this;
		this.practices.models.slice(0, this.length).forEach(function (practice) {
			setTimeout(function () {
				new practiceView(practice, self.listEl, self).render();	
			});
		});

		return this;
	},

	append: function () {
		this.listEl.classList.toggle('alt');
		new practiceView(this.practices.models[this.length - 1], this.listEl, this).render();
	}
});