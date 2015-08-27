var PieceView = require('../piece');
var SearchView = require('../search');

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
		this.listenTo(this.pieces, 'destroy', this.append);
		this.staticRender();
	},

	staticRender: function () {
		this.renderToDom(this.swig.render(this.tpl), true);
		this.listEl = this.el.querySelector('.practice-list__list');
		this.search = new SearchView(this.childOpts('search', {
			limit: -1,
			items: this.pieces.getTunebook(this.tunebook),
			getSubjects: function (piece) {
				if (piece.get('type') === 'tune') {
					return [piece.getSrc()];
				} else {
					return piece.getSrc().getTunes().concat([{
						get: function (key) {
							return key === 'name' ? piece.getSrc().get('name') : []
						}
					}])
				}
			}
		}));
		this.listenTo(this.search, 'results', this.render)
		this.listenTo(this.search, 'invalid', this.render)
		this.render();
	},

	render: function (results) {
		var it = this;
		// don't rerender when we're applying no filter to an already unfiltered list
		if (!results && !this.filtered && this.listEl.innerHTML) {
			return;
		}
		this.filtered = !!results;
		this.listEl.innerHTML = '';
		var pieces = results || this.pieces.getTunebook(this.tunebook).slice(0, this.length)
		pieces.forEach(function (piece) {
			setTimeout(function () {
				it.appendModel(piece);
			});
		});

		return this;
	},

	appendModel: function (model) {
		var pieceView = new PieceView(this.childOpts(this.listEl, {
			piece: model,
			inTunebook: this.tunebook
		})).render();
		this.listenTo(pieceView, 'abc-open', this.enforceUniqueAbc);
	},

	enforceUniqueAbc: function (piece) {
		this.abcViewer && this.abcViewer.destroy();
		this.abcViewer = piece.abcViewer;
	},

	append: function () {
		this.appendModel(this.pieces.getTunebook(this.tunebook)[this.length - 1]);
	}
});