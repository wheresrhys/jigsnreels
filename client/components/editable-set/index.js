var SetModel = require('../../data/models/set');
var allSets = require('../../data/collections/sets');
var AbcViewer = require('../abc-viewer')

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	name: 'editable-set',
	events: {
		'change .editable-set__tune__key-selector': 'changeKey',
		'change .editable-set__set-name': 'addName',
		'click .editable-set__form input[type="submit"]': 'save',
		'click .editable-set__delete': 'delete',
		'click .editable-set__tune__delete': 'deleteTune',
		'click .editable-set__tune__move-up': 'moveTuneUp',
		'click .editable-set__tune__view': 'viewTune'
	},

	initialize: function (opts) {
		this.isEditing = !!opts.id;
		this.parentEl = opts.parentEl;
		this.parent = opts.parent;
		this.render = this.render.bind(this);
		this.freshSet = this.freshSet.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		this.freshSet(opts.id);
		this.render();
		this.listenTo(this.parent, 'destroy', this.destroy);
	},

	render: function () {

		this.renderToDom(this.swig.render(this.tpl, {
			locals: {
				set: this.set.viewModel()
							.end(),
				isEditing: this.isEditing,
				tunebooks: window.user.tunebooks
			}
		}), true);

		// this.listenToOnce(this.tunesList, 'tune-clicked')
		return this;
	},

	appendTune: function (tuneId) {
		this.set.appendTune(tuneId);
		var pieces = require('../../data/collections/pieces');
		if (!pieces.isKnown(tuneId)) {
			this.abcViewer = new AbcViewer(this.childOpts('abc', {
				tuneId: tuneId,
				isDismissable: true
			}));
		}
	},

	viewTune: function (ev) {
		ev.preventDefault();
		this.abcViewer && this.abcViewer.destroy();
		this.abcViewer = new AbcViewer(this.childOpts('abc', {
			tuneId: ev.delegateTarget.parentNode.dataset.tuneId,
			isDismissable: true
		}));
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
		this.set.save().then(function (set) {
			this.afterSave(ev.delegateTarget.dataset.tunebook);
		}.bind(this));
	},
	afterSave: function (tunebook) {
		if (this.isEditing) {
			require('../../scaffolding/router').navigate('/practice' + destination, { trigger: true });
			return;
		}

		if (tunebook) {
			var pieces = require('../../data/collections/pieces');
			pieces.addPiece(this.set, 'set', tunebook)
			require('../../scaffolding/router').navigate('/practice/' + tunebook, { trigger: true })
		} else {
			this.isEditing = false;
			this.freshSet();
			require('../../scaffolding/router').navigate('/sets/edit', { trigger: false })
		}
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
							self.listenTo(self.set, 'change', self.render);
						}, function (err) {
							require('../../scaffolding/router').navigate('/sets', { trigger: true })
						});
				}
			} else {
				this.isEditing = false;
				this.set = new SetModel();
				this.listenTo(this.set, 'change', this.render);
			}
			this.render();
		}
	}
});