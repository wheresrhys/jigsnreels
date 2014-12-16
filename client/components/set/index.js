var ViewModel = require('../../data/view-models/set');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	events: {},
	initialize: function (opts) {
		this.set = opts.set;
		this.parentEl = opts.parentEl;

		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		this.listenTo(this.set, 'sync', this.render);
		this.listenTo(opts.parentView, 'destroy', this.destroy);
		this.render();
	},

	render: function () {
		var self = this;
		new ViewModel(this.set)
			.withTunes()
			.withTunebooks()
			.end(true)
			.then(function (setViewModel) {
				console.log(setViewModel);
				self.renderToDom(self.swig.render(self.tpl, setViewModel));
			});
		return this;
	},
	destroy: function () {
		this.closeAbc();
		this.simpleDestroy();
	}

});