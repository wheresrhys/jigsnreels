var PieceView = require('../piece');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	name: 'practice-list',
	events: {},

	initialize: function (opts) {
		this.pieces = opts.pieces;
		this.parentEl = opts.parentEl;
		this.tunebook = opts.tunebook;
		this.length = 20;
		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		this.enforceUniqueAbc = this.enforceUniqueAbc.bind(this);
		this.appendModel = this.appendModel.bind(this);
		this.listenTo(this.pieces, 'practiced', this.append);
		this.render();
	},

	render: function () {
		this.renderToDom(this.swig.render(this.tpl), true);
		this.listEl = this.el.querySelector('.practice-list__list');
		var self = this;
		this.pieces.getTunebook(this.tunebook).slice(0, this.length).forEach(function (piece) {
			setTimeout(function () {
				self.appendModel(piece);
			});
		});

		return this;
	},

	appendModel: function (model) {
		var pieceView = new PieceView(this.childOpts(this.listEl, {
			piece: model
		})).render();
		this.listenTo(pieceView, 'abc-open', this.enforceUniqueAbc);
	},

	enforceUniqueAbc: function (piece) {
		this.abcViewer && this.abcViewer.destroy();
		this.abcViewer = piece.abcViewer;
	},

	append: function () {
		this.listEl.classList.toggle('alt');
		this.appendModel(this.pieces.models[this.length - 1]);
	}
});