var swig = require('swig/index');
var TuneModel = require('../../models/tune');
var allTunes = require('../../collections/tunes');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	events: {
		// 'change .set-editor__tune__key-selector': 'changeKey',
		'change .set-editor__set-name': 'addName',
		'submit .set-editor__form': 'save',
		'click .set-editor__delete': 'delete'
	},

	initialize: function (el, id) {
		this.isEditing = !!id;
		this.parent = el;
		this.render = this.render.bind(this);
		this.freshTune = this.freshTune.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		this.freshTune(id);
	},

	render: function () {
		this.renderToDom(swig.render(this.tpl, {
			locals: {
				tune: this.tune.Presenter().toJSON(),
				isEditing: this.isEditing
			}
		}), true);
	},

	// changeKey: function (ev) {
	// 	var select = ev.delegateTarget;
	// 	this.tune.changeTuneKey(select.children[select.selectedIndex].value, select.parentNode.dataset.tuneId);
	// },

	addName: function (ev) {
		this.tune.set('name', ev.delegateTarget.value);
	},
	save: function (ev) {
		ev.preventDefault();
		this.tune.save();
	},
	delete: function (ev) {
		if (window.confirm('Are you sure you want to delete the tune ' + this.tune.get('name').toUpperCase() + ': ' + this.tune.tuneNames().join(', '))) {
			this.tune.destroy();
		}
	},

	freshTune: function (id) {
		var self = this;
		if (!this.isEditing || typeof id === 'string') {
			this.tune && this.stopListening(this.tune, 'change');
			if (typeof id === 'string') {
				this.tune = allTunes.models.filter(function (model) {
					return model.get('_id') === id;
				})[0];
				if (this.tune) {
					this.listenToOnce(this.tune, 'sync', function () {
						require('../../scaffolding/router').navigate('/practice', { trigger: true })
					});	
					this.listenTo(this.tune, 'change', this.render);
				} else {
					this.tune = new TuneModel();
					this.tune.set({_id: id}).fetch().then(function () {
						self.render();
						self.listenToOnce(self.tune, 'sync', function () {
							require('../../scaffolding/router').navigate('/practice', { trigger: true });
						});
					});
				}
			} else {
				this.tune = new TuneModel();
				this.listenToOnce(this.tune, 'sync', this.freshTune);
				this.listenTo(this.tune, 'change', this.render);
			}
			this.render();		
		}
	}
});