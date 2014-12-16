
// keep an accurate enough reference to the current time;
var now = new Date();
var user = window.user;
var tunebooks = {};
var tunebookPromises = {};

setTimeout(function () {
	now = new Date();
}, 1000);

var sets = require('./sets');
var Pieces = module.exports = require('backbone-es6').Collection.extend({
	name: 'pieces',
	url: function () {
		return require('../../scaffolding/api').url('pieces', null, this.tunebook)
	},
	model: require('../models/piece'),
	Presenter: require('./pieces-presenter'),

	initialize: function (opts) {
		var self = this;
		this.tunebook = opts.tunebook;
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
	get: function (tunebook, asPromise) {
		var tunebookName = tunebook || '';
		tunebook = tunebooks[tunebookName] || (tunebooks[tunebookName] = new Pieces({
			tunebook: tunebookName
		}));
		if (asPromise) {
			tunebook = tunebookPromises[tunebookName] || (tunebookPromises[tunebookName] = tunebooks[tunebookName].fetch());
		}
		return tunebook;
	},
	contains: function (tunebook, type, id) {
		return this.get(tunebook, true).then(function (pieces) {
			return
		});
	},
	addTunebooks: function (resource, type) {
		var self = this;
		return Promise.all(user.tunebooks.map(function (tunebook) {
			return self.get(tunebook, true);
		}))
			.then(function (tunebooks) {
				var isIn = [];
				tunebooks.forEach(function (pieces, index) {
					if (pieces.some(function (piece) {
						return piece.srcId === resource._id && piece.type === type;
					})) {
						isIn.push(user.tunebooks[index])
					}
				});
				resource.tunebooks = isIn;
				return resource;
			})
			.catch(function(err){
				console.log(err)
			})
	}
});