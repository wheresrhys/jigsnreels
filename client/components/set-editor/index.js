var TuneView = require('../tune');
var SearchView = require('../search');
var tuneTpl = require('./tune.html');
var allPieces = require('../../data/collections/pieces');
var EditableSet = require('../editable-set')

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	name: 'set-editor',
	events: {
		'click .set-editor__tune': 'selectTune'
	},

	initialize: function (opts) {
		this.opts = opts;
		this.parentEl = opts.parentEl;
		this.parent = opts.parent;
		this.render = this.render.bind(this);
		this.selectTune = this.selectTune.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		this.parent && this.listenTo(this.parent, 'destroy', this.destroy);
		this.staticRender();
	},
	staticRender: function () {

		this.renderToDom(this.swig.render(this.tpl, {
			locals: {
				tuneSuggestions: allPieces.getOrphanedTunes().map(function (tune) {
					return tune.viewModel().withTunebooks().withPiece().end();
				}).sort(function (tune1, tune2) {
					var p1 = tune1.piece.lastPracticeQuality;
					var p2 = tune1.piece.lastPracticeQuality;
					return p1 === p2 ? 0 : p1 > p2 ? -1 : 1;
				}),
				isSuggestion: true
			}
		}), true);

		this.searchResultsEl = this.el.querySelector('.set-editor__tune-search__results');

		this.editableSet = new EditableSet(this.childOpts('editable-set', {
			id: this.opts.id
		}));

		this.search = new SearchView(this.childOpts('tune-search__input', {
			limit: 5
		}));

		this.listenTo(this.search, 'results', this.render)
		this.listenTo(this.search, 'invalid', this.render)

		return this;
	},

	render: function (results) {
		this.searchResultsEl.innerHTML = '';
		if (!results) {
			return;
		}
		var html = '';
		var it = this;
		results.forEach(function (tune) {
			html += it.swig.render(tuneTpl, {
				locals: {
					tune: tune.viewModel().withTunebooks().end()
				}
			})
		});
		this.searchResultsEl.innerHTML = html;
		return this;
	},
	selectTune: function (ev) {
		this.editableSet.appendTune(ev.delegateTarget.dataset.tuneId);
		if (ev.delegateTarget.dataset.suggestion) {
			ev.delegateTarget.classList.add('hidden');
		} else {
			this.render([]);
			this.search.clear();
		}
	}
});