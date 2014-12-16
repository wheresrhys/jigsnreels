var pieces = require('../../data/collections/pieces');

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

		var sets = this.sets.Presenter().toJSON(true);
		var self = this;
		Promise.all(sets.locals.sets.map(function(set) {
			return pieces.addTunebooks(set, 'set');
		}))
			.then(function (sets) {
				self.renderToDom(self.swig.render(self.tpl, {
					locals: {
						sets: sets
					}
				}), true);
			})

	}
});