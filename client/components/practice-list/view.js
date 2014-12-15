var swig = require('swig/index');
var PieceView = require('../piece/view');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),

	events: {},

	initialize: function (opts) {
		this.pieces = opts.pieces;
		this.parentEl = opts.parentEl;
		this.length = 20;
		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		this.enforceUniqueAbc = this.enforceUniqueAbc.bind(this);
		this.appendModel = this.appendModel.bind(this);
		var self = this;
		opts.piecesPromise.then(function (pieces) {

			self.listenTo(self.pieces, 'practiced', self.append);
			self.render();
		});
	},

	render: function () {
		this.renderToDom(swig.render(this.tpl, this.pieces.Presenter().toJSON(true)), true);
		this.listEl = this.el.querySelector('.practice-list__list');
		var self = this;
		this.pieces.models.slice(0, this.length).forEach(function (piece) {
			setTimeout(function () {
				self.appendModel(piece);
			});
		});

		return this;
	},

	appendModel: function (model) {
		var pieceView = new PieceView({
			piece: model,
			parentEl: this.listEl,
			parentView: this
		}).render();
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