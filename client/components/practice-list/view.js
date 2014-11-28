var swig = require('swig/index');
var practiceView = require('../practice/view');
var practices = require('../../collections/practices');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	
	events: {},

	initialize: function (opts) {
		this.practices = practices;
		this.parentEl = opts.parentEl;
		this.length = 20;
		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		var self = this;
		opts.practicesPromise.then(function (){
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
				new practiceView({
					practice: practice, 
					parentEl: self.listEl,
					parentView: self
				}).render();	
			});
		});

		return this;
	},

	append: function () {
		this.listEl.classList.toggle('alt');
		new practiceView({
			practice: this.practices.models[this.length - 1], 
			parentEl: this.listEl,
			parentView: this
		}).render();
	}
});