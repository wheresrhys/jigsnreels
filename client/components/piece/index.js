var AbcViewer = require('../abc-viewer');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	name: 'piece',
	events: {
		'click .piece__practice': 'practice',
		'click .piece__remove': 'remove',
		'click .piece__view-abc': 'viewAbc',
	},
	initialize: function (opts) {
		this.piece = opts.piece;
		this.opts = opts;
		this.parentEl = opts.parentEl;
		this.parent = opts.parent;
		this.render = this.render.bind(this);

		this.listenTo(this.piece, 'sync', this.render);
		this.listenTo(this.parent, 'destroy', this.destroy);
		this.listenTo(this.piece, 'destroy', this.destroy);
		this.render();
	},

	render: function () {
		var it = this;
		this.renderToDom(it.swig.render(it.tpl, this.piece.viewModel().withSrc().end(true)));
		return this;
	},
	practice: function (ev) {
		this.piece.practice(ev.delegateTarget.dataset.practiceType)
		this.destroy();
	},
	viewAbc: function (ev) {
		this.abcViewer = new AbcViewer(this.childOpts('abc', {
			tuneId: ev.delegateTarget.dataset.tuneId,
			isDismissable: true
		}));
		this.trigger('abc-open', this);
	},
	closeAbc: function () {
		this.abcViewer && this.abcViewer.destroy();
		delete this.abcViewer;
	},
	destroy: function () {
		this.closeAbc();
		this.simpleDestroy();
	},
	remove: function () {
		this.piece.destroy();
	}

});