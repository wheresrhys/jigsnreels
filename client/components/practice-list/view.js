var swig = require('swig/index');
var PracticeView = require('../practice/view');
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
		this.enforceUniqueAbc = this.enforceUniqueAbc.bind(this);
		this.appendModel = this.appendModel.bind(this);
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
				self.appendModel(practice);
			});
		});

		return this;
	},

	appendModel: function (model) {
		var practiceView = new PracticeView({
			practice: model, 
			parentEl: this.listEl,
			parentView: this
		}).render();	
		this.listenTo(practiceView, 'abc-open', this.enforceUniqueAbc);
	},

	enforceUniqueAbc: function (practice) {
		this.abcViewer && this.abcViewer.destroy();
		this.abcViewer = practice.abcViewer;
	},

	append: function () {
		this.listEl.classList.toggle('alt');
		this.appendModel(this.practices.models[this.length - 1]);
	}
});