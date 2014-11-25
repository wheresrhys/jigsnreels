var swig = require('swig/index');
var practiceView = require('../practice/view');
var practices = require('../../collections/practices');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	
	events: {},

	initialize: function (practicesPromise, el) {
		this.practices = practices;
		this.parent = el;
		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		var self = this;
		practicesPromise.then(function (){
			self.listenTo(self.practices, 'sync', self.render);
			self.render();
		});

	},

	render: function () {
		this.renderToDom(swig.render(this.tpl, this.practices.Presenter().toJSON(true)), true);
		var list = this.el.querySelector('.practice-list__list');
		var self = this;
		this.practices.models.forEach(function (practice) {
			setTimeout(function () {
				new practiceView(practice, list, self).render();	
			});
		});

		return this;
	}
});