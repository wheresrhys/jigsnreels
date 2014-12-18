var TunePicker = require('../tune-picker')
var EditableSet = require('../editable-set')


module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	name: 'set-editor',
	events: {},

	initialize: function (opts) {
		this.opts = opts;
		this.parentEl = opts.parentEl;
		this.parent = opts.parent;
		this.render = this.render.bind(this);
		this.appendTune = this.appendTune.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		this.parent && this.listenTo(this.parent, 'destroy', this.destroy);
		this.render();
	},

	render: function () {

		this.renderToDom(this.swig.render(this.tpl), true);
		this.tunePicker = new TunePicker(this.childOpts('tune-picker', {
			limit: 5
		}));

		this.listenTo(this.tunePicker, 'tune-selected', this.appendTune);

		this.editableSet = new EditableSet(this.childOpts('editable-set', {
			id: this.opts.id
		}));

		return this;
	},

	appendTune: function (tuneId) {
		this.editableSet.appendTune(tuneId);
	}
});