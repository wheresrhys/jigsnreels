var TuneView = require('../tune');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	events: {},
	initialize: function (opts) {
		this.tunes = opts.tunes;
		this.parentEl = opts.parentEl;
		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		this.listenTo(this.tunes, 'sync', this.render);
		this.render();
	},

	render: function () {
		this.renderToDom(this.swig.render(this.tpl), true);
		this.listEl = this.el.querySelector('.tune-list__list');
		var self = this;
		this.tunes.models.forEach(function (model) {
			setTimeout(function () {
				var tuneView = new TuneView({
					tune: model,
					parentEl: self.listEl,
					parentView: self
				}).render();
			});
		});

		return this;
	}

});