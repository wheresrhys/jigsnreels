
// keep an accurate enough reference to the current time;
var now = new Date();

setTimeout(function () {
	now = new Date();
}, 1000);

var sets = require('./sets');
var Pieces = require('backbone-es6').Collection.extend({
	name: 'pieces',
	url: require('../../scaffolding/api').url('pieces'),
	model: require('../models/piece'),
	Presenter: require('./pieces-presenter'),

	initialize: function () {
		var self = this;
		this.listenTo(sets, 'newPiece', function () {
			// this
			console.log(arguments);
			// this.removeForSrc.bind(this)
		});
		this.listenTo(sets, 'destroy', this.removeForSrc.bind(this));
		this.on('practiced', function (piece) {
			self.reInsert(piece);
		});
	},
	reInsert: function (piece) {
		var score = this.comparator(piece);
		var self = this;
		self.models.splice(self.models.indexOf(piece), 1);
		this.models.some(function (compare, index) {
			if (compare.score > score) {
				self.models.splice(index, 1, piece);
				return true;
			}
		}) || this.models.push(piece);	
	},
	comparator: function (piece) {
		var timeAgo = (now - new Date(piece.get('lastPieced'))) / (24 * 60 * 60 * 1000);
		if (isNaN(timeAgo)) {
			return 0;
		}
		var score = (-timeAgo / 2) + 
			1 * piece.get('lastPieceQuality') +
			-1 * piece.get('stickiness');	
		piece.score = score;
		return score;
	},
	removeForSrc: function (src) {
		this.models.forEach(function (piece) {
			if (piece.get('srcId') === src.get('_id')) {
				piece.destroy();
			}
		});
	}
});

module.exports = new Pieces();