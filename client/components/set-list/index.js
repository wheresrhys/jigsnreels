var SetView = require('../set');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	events: {},
	initialize: function (opts) {
		this.sets = opts.sets;
		this.parentEl = opts.parentEl;
		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		this.listenTo(this.sets, 'sync', this.render);
		this.render();
	},

	render: function () {
		this.renderToDom(this.swig.render(this.tpl), true);
		this.listEl = this.el.querySelector('.set-list__list');
		var self = this;
		this.sets.models.forEach(function (model) {
			var setView = new SetView({
				set: model,
				parentEl: self.listEl,
				parentView: self
			}).render();
		});

		return this;
	}

});