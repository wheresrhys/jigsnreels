
// keep an accurate enough reference to the current time;
var now = new Date();

setTimeout(function () {
	now = new Date();
}, 1000);

var sets = require('./sets');
var Practices = require('exoskeleton').Collection.extend({
	name: 'practices',
	url: require('../../scaffolding/api').url('practices'),
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
		this.on('practiced', function (practice) {
			console.log(practice);
			self.reInsert(practice);
		});
	},
	reInsert: function (practice) {
		var score = this.comparator(practice);
		var self = this;
		self.models.splice(self.models.indexOf(practice), 1);
		this.models.some(function (compare, index) {
			if (compare.score > score) {
				self.models.splice(index, 1, practice);
				return true;
			}
		}) || this.models.push(practice);	
	},
	comparator: function (practice) {
		var timeAgo = (now - new Date(practice.get('lastPracticed'))) / (24 * 60 * 60 * 1000);
		if (isNaN(timeAgo)) {
			return 0;
		}
		var score = (-timeAgo / 2) + 
			1 * practice.get('lastPracticeQuality') +
			-1 * practice.get('stickiness');	
		practice.score = score;
		return score;
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