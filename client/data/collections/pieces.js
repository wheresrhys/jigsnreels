
// keep an accurate enough reference to the current time;
var now = new Date();
var user = window.user;
var tunebooks = {};
var tunebookPromises = {};

setTimeout(function () {
	now = new Date();
}, 1000);

var Pieces = module.exports = require('backbone-es6').Collection.extend({
	name: 'pieces',
	url: function () {
		return require('../../scaffolding/api').url('pieces', null, this.tunebook)
	},
	model: require('../models/piece'),

	initialize: function (opts) {
		var self = this;
		this.tunebook = opts.tunebook;
		var sets = require('./sets');
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
}, {
	getTunebook: function (tunebook, asPromise) {
		var tunebookName = tunebook || '';
		tunebook = tunebooks[tunebookName] || (tunebooks[tunebookName] = new Pieces({
			tunebook: tunebookName
		}));
		if (asPromise) {
			tunebook = tunebookPromises[tunebookName] || (tunebookPromises[tunebookName] = tunebooks[tunebookName].fetch());
		}
		return tunebook;
	},
	getAll: function (asPromise) {
		return user.tunebooks.map(function (tunebook) {
			return Pieces.getTunebook(tunebook, asPromise);
		})
	},
	getTunebooksForResource: function (model) {
		var self = this;
		return user.tunebooks.map(function (tunebook) {
			return {
				name: tunebook,
				isListed: self.getTunebook(tunebook).some(function (piece) {
					return piece.get('srcId') === model.id;
				})
			}
		})
	}
});