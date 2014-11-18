var swig = require('swig/index');
var SetModel = require('../../models/set');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	events: {
        'change .set-builder__tune-selector': 'appendTune',
        'change .set-builder__tune__key-selector': 'changeKey',
        'change .set-builder__set-name': 'addName',
        'submit .set-builder__form': 'save'
	},

	initialize: function (tunes, el) {
		this.allTunes = tunes;
		this.parent = el;
		this.render = this.render.bind(this);
		this.freshSet = this.freshSet.bind(this);
		this.listenTo(this.allTunes, 'sync', this.render);
		this.freshSet();
	},

	render: function () {
		this.renderToDom(swig.render(this.tpl, {
			locals: {
				set: this.set.Presenter().toJSON(),
				tunes: this.allTunes.Presenter({
					by: 'rhythm'
				}).toJSON()
			}
		}));
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

	freshSet: function () {
		this.set && this.stopListening(this.set, 'change');
		this.set = new SetModel();
		this.listenToOnce(this.set, 'sync', this.freshSet);
		this.listenTo(this.set, 'change', this.render);
		this.render();		
	}
});