
// keep an accurate enough reference to the current time;
var now;

setTimeout(function () {
	now = new Date();
}, 1000);

var sets = require('./sets');
var Practices = require('exoskeleton').Collection.extend({
	name: 'practices',
	url: require('../scaffolding/api').url('practices'),
	model: require('../models/practice'),
	Presenter: require('./practices-presenter'),

	initialize: function () {
		var self = this;
		this.listenTo(sets, 'newPractice', function () {
			// this
			console.log(arguments);
			// this.removeForSrc.bind(this)
		});
		this.listenTo(sets, 'destroy', this.removeForSrc.bind(this));
		this.on('change', function () {
			//self.sort();
		})
	},
	comparator: function (practice) {
		var timeAgo = now - new Date(practice.get('lastPracticed')) / (24 * 60 * 60 * 1000);
		if (isNaN(timeAgo)) {
			timeAgo = 30;
		}
		return -timeAgo / 2 + 
			3 * practice.get('lastPracticeQuality') +
			-1 * practice.get('stickiness');	
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