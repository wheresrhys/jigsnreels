var sets = require('./sets');
var Practices = require('exoskeleton').Collection.extend({
	name: 'practices',
	url: require('../scaffolding/api').url('practices'),
	model: require('../models/practice'),
	Presenter: require('./practices-presenter'),

	initialize: function () {
		var self = this;
		this.listenTo(sets, 'destroy', this.removeForSrc.bind(this));
	},
	
	removeForSrc: function (src) {
		this.models.forEach(function (practice) {
			if (practice.get('srcId') === src.get('_id')) {
				practice.destroy();
			}
		});
	}
});

module.exports = new Practices();