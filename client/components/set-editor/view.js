var swig = require('swig/index');
var SetModel = require('../../models/set');
var allSets = require('../../collections/sets');
var allTunes = require('../../collections/tunes');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	events: {
        'change .set-editor__tune-selector': 'appendTune',
        'change .set-editor__tune__key-selector': 'changeKey',
        'change .set-editor__set-name': 'addName',
        'submit .set-editor__form': 'save',
        'click .set-editor__delete': 'delete',
        'click .set-editor__tune__delete': 'deleteTune'
	},

	initialize: function (tunesPromise, el, id) {
		this.isEditing = !!id;
		this.tunesPromise = tunesPromise;
		this.parent = el;
		this.render = this.render.bind(this);
		this.freshSet = this.freshSet.bind(this);
		this.tunesPromise.then(this.render);
		this.freshSet(id);
	},

	render: function () {
		this.renderToDom(swig.render(this.tpl, {
			locals: {
				set: this.set.Presenter().toJSON(),
				isEditing: this.isEditing,
				tunes: allTunes.Presenter({
					by: 'rhythm',
					sort: function (a, b) {
						return a.get('keys')[0].charAt(0) > b.get('keys')[0].charAt(0) ? 1 : -1;
					}
				}).toJSON()
			}
		}), true);
	},

	appendTune: function (ev) {
		var select = ev.delegateTarget;
		this.set.appendTune(select.children[select.selectedIndex].value);
	},

	deleteTune: function (ev) {
		ev.preventDefault();
		this.set.removeTune(ev.delegateTarget.parentNode.dataset.tuneId);
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
		if (confirm('Are you sure you want to delete the set ' + this.set.get('name').toUpperCase() + ': ' + this.set.tuneNames().join(', '))) {
			this.set.destroy();
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