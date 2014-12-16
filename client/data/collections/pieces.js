
// keep an accurate enough reference to the current time;
var now = new Date();
var user = window.user;

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
		var sets = require('./sets');
		this.isInTunebook = this.isInTunebook.bind(this);
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
	addPiece: function (id, type, tunebook) {
		return this.add({
			srcId: id,
			type: type,
			tunebook: 'wheresrhys:' + tunebook
		}).save();
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
	},
	getTunebook: function (tunebook) {
		return this.models.filter(function (piece) {
			return piece.get('tunebook') === 'wheresrhys:' + tunebook;
		})
	},
	getTunebooksForResource: function (model, type) {
		var setsHash = {};

		function getSets (tunebook) {
			var setsCollection = require('./sets');
			var sets = setsHash[tunebook] || (setsHash[tunebook] = this.models.filter(function (piece) {
				return piece.get('type') === 'set' && piece.get('tunebook') === 'wheresrhys:' + tunebook;
			}).map(function (piece) {
				return setsCollection.models.filter(function (set) {
					return set.id === piece.get('srcId');
				})[0].get('tunes');
			}))
			return sets;
		}
		return user.tunebooks.map(function (tunebook) {
			if (type === 'tune') {
				var sets = getSets.call(this, tunebook);
			}
			return {
				name: tunebook,
				isListed: this.isInTunebook(model, tunebook) || (type === 'tune' && this.hasSetInTunebook(model, sets))
			}
		}.bind(this));
	},
	isInTunebook: function (model, tunebook, type) {
		return this.models.some(function (piece) {
			return piece.get('srcId') === model.id && piece.get('tunebook') === 'wheresrhys:' + tunebook;
		})
	},
	hasSetInTunebook: function (model, sets) {
		return sets.some(function (set) {
			return set.indexOf(model.id) > -1;
		})
	}
});

module.exports = new Pieces();