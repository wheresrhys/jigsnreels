
// keep an accurate enough reference to the current time;
var now = new Date();
var user = window.user;

setTimeout(function () {
	now = new Date();
}, 1000);

var tunebooksHash;

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
		this.on('add', function () {
			//TODO edit the tunebookshash rather than clearing it
			tunebooksHash = null;
		});
		this.on('remove', function () {
			//TODO edit the tunebookshash rather than clearing it
			tunebooksHash = null;
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
	togglePiece: function (id, type, tunebook, add) {

		if (add) {
			return this.addPiece(id, type, tunebook, add);
		}

		this.models.forEach(function (piece) {
			if (piece.get('srcId') === id && piece.get('tunebook') === 'wheresrhys:' + tunebook) {
				piece.destroy();
			}
		});
		return Promise.resolve();
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
		var srcId = src.get('_id');
		this.models.forEach(function (piece) {
			if (piece.get('srcId') === srcId) {
				piece.destroy();
			}
		});
	},
	getTunebook: function (tunebook) {
		if (!tunebook) {
			return this.models.slice();
		}
		return this.models.filter(function (piece) {
			return piece.get('tunebook') === 'wheresrhys:' + tunebook;
		})
	},
	getIdsByTunebook: function () {
		if (tunebooksHash) {
			return tunebooksHash;
		}
		tunebooksHash = {};
		var setsCollection = require('./sets');
		var self = this;
		user.tunebooks.forEach(function (tunebook) {
			var idsHash = {};
			self.models.filter(function (piece) {
				return piece.get('tunebook') === 'wheresrhys:' + tunebook;
			}).forEach(function (piece) {
				idsHash[piece.get('srcId')] = true;
				if (piece.get('type') === 'set') {
					setsCollection.models.filter(function (set) {
						return set.id === piece.get('srcId');
					})[0].get('tunes').forEach(function(tune) {
						idsHash[tune] = true;
					});
				}
			})
			tunebooksHash[tunebook] = Object.keys(idsHash);
		});
		return tunebooksHash;
	},

	getTunebooksForResource: function (model) {
		var tuneBooksHash = this.getIdsByTunebook();
		return user.tunebooks.map(function (tunebook) {
			return {
				name: tunebook,
				isListed: tunebooksHash[tunebook].indexOf(model.id) > -1
			}
		});
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
	},
	populate: function () {
		return this.promise || (this.promise = this.fetch({parse: true}));
	}
});
module.exports = new Pieces()