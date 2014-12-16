var AbcViewer = require('../abc-viewer');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	events: {
		'click .piece__practice--good': 'practice',
		'click .piece__practice--bad': 'practice',
		'click .piece__practice--skip': 'practice',
		'click .piece__view-abc': 'viewAbc',
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
		var self = this;
		this.piece.viewModel()
			.end(true)
			.then(function (viewModel) {
				self.renderToDom(self.swig.render(self.tpl, viewModel));
			});
		this.abcEl = this.el.querySelector('.piece__abc');
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