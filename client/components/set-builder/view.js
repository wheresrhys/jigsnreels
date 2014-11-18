var swig = require('swig/index');
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
		this.set = new (require('../../models/set'))();
		this.listenTo(this.allTunes, 'sync', this.render.bind(this));
		this.listenTo(this.set, 'change', this.render.bind(this));
		this.render();
	},

	render: function () {
		this.renderToDom(swig.render(this.tpl, {
			locals: {
				set: this.set.Presenter({persist: true}).toJSON(),
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
	}
});