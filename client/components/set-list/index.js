var SetView = require('../set');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	name: 'set-list',
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
		this.sets.models.sort(function (m1, m2) {
			var m1l = m1.tunebooks().length;
			var m2l = m2.tunebooks().length;
			return (m1l === m2l) ? 0 : (m1l > m2l) ? 1 : -1;
		}).forEach(function (model) {
			setTimeout(function () {
				var setView = new SetView(self.childOpts(self.listEl, {
					set: model
				})).render();
			});
		});

		return this;
	}

});