var SetModel = require('../../data/models/set');
var allSets = require('../../data/collections/sets');
var allTunes = require('../../data/collections/tunes');
var AbcViewer = require('../abc-viewer')

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	events: {
		'change .set-editor__tune-selector': 'appendTune',
		'change .set-editor__tune__key-selector': 'changeKey',
		'change .set-editor__set-name': 'addName',
		'submit .set-editor__form': 'save',
		'click .set-editor__delete': 'delete',
		'click .set-editor__tune__delete': 'deleteTune',
		'click .set-editor__tune__move-up': 'moveTuneUp',
		'click .set-editor__tune__view': 'viewTune'
	},

	initialize: function (opts) {
		this.isEditing = !!opts.id;
		this.tunes = opts.tunes;
		this.parentEl = opts.parentEl;
		this.render = this.render.bind(this);
		this.freshSet = this.freshSet.bind(this);

		this.destroy = this.simpleDestroy.bind(this);
		this.freshSet(opts.id);
		this.render();
	},

	render: function () {

		this.renderToDom(this.swig.render(this.tpl, {
			locals: {
				set: this.set.viewModel()
							.end(),
				isEditing: this.isEditing,
				tunes: allTunes.viewModel()
								.childDo('end')
								.sortByName()
								.groupBy('rhythm')
								.sortBy(function (a, b) {
									return a.keys[0].charAt(0) > b.keys[0].charAt(0) ? 1 : -1;
								})
								.end()
			}
		}), true);

		this.abcEl = this.el.querySelector('.set-editor__abc-viewer');
		return this;
	},

	appendTune: function (ev) {
		var select = ev.delegateTarget;
		var tuneId = select.children[select.selectedIndex].value;
		this.set.appendTune(tuneId);
		this.abcViewer = new AbcViewer({
			tuneId: tuneId,
			parentEl: this.abcEl,
			parentView: this,
			isDismissable: true
		});
	},

	viewTune: function (ev) {
		ev.preventDefault();
		this.abcViewer && this.abcViewer.destroy();
		this.abcViewer = new AbcViewer({
			tuneId: ev.delegateTarget.parentNode.dataset.tuneId,
			parentEl: this.abcEl,
			parentView: this,
			isDismissable: true
		});
	},

	deleteTune: function (ev) {
		ev.preventDefault();
		this.set.removeTune(ev.delegateTarget.parentNode.dataset.tuneId);
	},

	moveTuneUp: function (ev) {
		ev.preventDefault();
		this.set.moveTuneUp(ev.delegateTarget.parentNode.dataset.tuneId);
	},

	changeKey: function (ev) {
		var select = ev.delegateTarget;
		this.set.changeTuneKey(select.children[select.selectedIndex].value, select.parentNode.dataset.tuneId);
	},

	addName: function (ev) {
		this.set.set('name', ev.delegateTarget.value);
	},
	save: function (ev) {
		ev.preventDefault();
		this.set.save();
	},
	delete: function (ev) {
		if (window.confirm('Are you sure you want to delete the set ' + this.set.get('name').toUpperCase() + ': ' + this.set.tuneNames().join(', '))) {
			this.set.delete();
		}
	},

	freshSet: function (id) {
		var self = this;
		if (!this.isEditing || typeof id === 'string') {
			this.set && this.stopListening(this.set, 'change');
			if (typeof id === 'string') {
				this.set = allSets.models.filter(function (model) {
					return model.get('_id') === id;
				})[0];
				if (this.set) {
					this.listenToOnce(this.set, 'sync', function () {
						require('../../scaffolding/router').navigate('/practice', { trigger: true })
					});
					this.listenTo(this.set, 'change', this.render);
				} else {
					this.set = new SetModel()
					Promise.all([this.set.set({_id: id}).fetch(), this.tunesPromise]).then(function () {
						self.render();
						self.listenToOnce(self.set, 'sync', function () {
							require('../../scaffolding/router').navigate('/practice', { trigger: true });
						});
						self.listenTo(self.set, 'change', self.render);
					});
				}
			} else {
				this.set = new SetModel();
				this.listenToOnce(this.set, 'sync', this.freshSet);
				this.listenTo(this.set, 'change', this.render);
			}
			this.render();
		}
	}
});