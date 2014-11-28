var swig = require('swig/index');
var AbcViewer = require('../abc-viewer/view');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	events: {
		'click .practice__good': 'doPractice',
		'click .practice__bad': 'doPractice',
		'click .practice__skip': 'doPractice',
		'click .practice__view-abc': 'viewAbc',
	},
	initialize: function (opts) {
		this.practice = opts.practice;
		this.parentEl = opts.parentEl;

		this.render = this.render.bind(this);
		
		this.listenTo(this.practice, 'sync', this.render);
		this.listenTo(opts.parentView, 'destroy', this.destroy);
		// this.listenTo(this.practice, 'destroy', this.destroy);
		this.render();
	},

	render: function () {
		this.renderToDom(swig.render(this.tpl, this.practice.Presenter().toJSON(true)))
		this.abcEl = this.el.querySelector('.practice__abc');
		return this;
	},
	doPractice: function (ev) {
		this.practice.doPractice(ev.delegateTarget.dataset.practiceType)
		this.destroy();
	},
	viewAbc: function (ev) {
		this.abcViewer = new AbcViewer({
			tuneId: ev.delegateTarget.dataset.tuneId,
			parentEl: this.abcEl, 
			parentView: this
		});  
	},
	destroy: function () {
		this.abcViewer && this.abcViewer.destroy();
		this.simpleDestroy();
	}

});