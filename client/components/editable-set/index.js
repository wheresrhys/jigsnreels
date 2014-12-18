var SetModel = require('../../data/models/set');
var allSets = require('../../data/collections/sets');
var AbcViewer = require('../abc-viewer')

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	events: {
		'change .editable-set__tune__key-selector': 'changeKey',
		'change .editable-set__set-name': 'addName',
		'submit .editable-set__form': 'save',
		'click .editable-set__delete': 'delete',
		'click .editable-set__tune__delete': 'deleteTune',
		'click .editable-set__tune__move-up': 'moveTuneUp',
		'click .editable-set__tune__view': 'viewTune'
	},

	initialize: function (opts) {
		this.isEditing = !!opts.id;
		this.tunes = require('../../data/collections/tunes')
		this.parentEl = opts.parentEl;
		this.parent = opts.parent;
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
				isEditing: this.isEditing
			}
		}), true);

		// this.listenToOnce(this.tunesList, 'tune-clicked')
		this.abcEl = this.el.querySelector('.editable-set__abc-viewer');
		return this;
	},

	appendTune: function (tuneId) {
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
		// typeof id === 'string' ensures it's the first call of this function when editing
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
					this.set.set({_id: id}).fetch()
						.then(function () {
							self.render();
							self.listenToOnce(self.set, 'sync', function () {
								require('../../scaffolding/router').navigate('/practice', { trigger: true });
							});
							self.listenTo(self.set, 'change', self.render);
						}, function (err) {
							require('../../scaffolding/router').navigate('/sets', { trigger: true })
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