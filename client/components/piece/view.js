var swig = require('swig/index');
var AbcViewer = require('../abc-viewer/view');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	events: {
		'click .practice__good': 'practice',
		'click .practice__bad': 'practice',
		'click .practice__skip': 'practice',
		'click .practice__view-abc': 'viewAbc',
	},
	initialize: function (opts) {
		this.piece = opts.piece;
		this.parentEl = opts.parentEl;

		this.render = this.render.bind(this);
		
		this.listenTo(this.piece, 'sync', this.render);
		this.listenTo(opts.parentView, 'destroy', this.destroy);
		// this.listenTo(this.piece, 'destroy', this.destroy);
		this.render();
	},

	render: function () {
		this.renderToDom(swig.render(this.tpl, this.piece.Presenter().toJSON(true)))
		this.abcEl = this.el.querySelector('.practice__abc');
		return this;
	},
	practice: function (ev) {
		this.piece.practice(ev.delegateTarget.dataset.practiceType)
		this.destroy();
	},
	viewAbc: function (ev) {
		this.abcViewer = new AbcViewer({
			tuneId: ev.delegateTarget.dataset.tuneId,
			parentEl: this.abcEl, 
			parentView: this,
			isDismissable: true
		});
		this.trigger('abc-open', this);
	},
	closeAbc: function () {
		this.abcViewer && this.abcViewer.destroy();
		delete this.abcViewer;
	},
	destroy: function () {
		this.closeAbc();
		this.simpleDestroy();
	}

});