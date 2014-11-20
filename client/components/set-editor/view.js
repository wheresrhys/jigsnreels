var swig = require('swig/index');
var SetModel = require('../../models/set');
var allSets = require('../../collections/sets');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	events: {
        'change .set-builder__tune-selector': 'appendTune',
        'change .set-builder__tune__key-selector': 'changeKey',
        'change .set-builder__set-name': 'addName',
        'submit .set-builder__form': 'save'
	},

	initialize: function (tunes, el, id) {
		this.isEditing = !!id;
		this.allTunes = tunes;
		this.parent = el;
		this.render = this.render.bind(this);
		this.freshSet = this.freshSet.bind(this);
		this.listenTo(this.allTunes, 'sync', this.render);
		this.freshSet(id);
	},

	render: function () {
		this.renderToDom(swig.render(this.tpl, {
			locals: {
				set: this.set.Presenter().toJSON(),
				tunes: this.allTunes.Presenter({
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

	freshSet: function (id) {
		if (!this.isEditing || id) {
			this.set && this.stopListening(this.set, 'change');
			if (id) {
				this.set = allSets.models.filter(function (model) {
					return model.get('_id') === id;
				})[0];
				if (this.set) {
					this.listenToOnce(this.set, 'sync', function () {
						console.log('saved');
					});	
				}
			} else {
				this.set = new SetModel();
				this.listenToOnce(this.set, 'sync', this.freshSet);
			}
			this.set && this.listenTo(this.set, 'change', this.render);
			this.render();		
		}
	}
});