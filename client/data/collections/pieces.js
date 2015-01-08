// keep an accurate enough reference to the current time;
var now = new Date();
var user = window.user;

setTimeout(function () {
	now = new Date();
}, 1000);

var tunebooksHash;

var Pieces = module.exports = require('../../scaffolding/collection').extend({
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
	togglePiece: function (src, type, tunebook, add) {

		if (add) {
			return this.addPiece(src, type, tunebook, add);
		}

		this.models.forEach(function (piece) {
			if (piece.get('srcId') === src.id && piece.get('tunebook') === 'wheresrhys:' + tunebook) {
				piece.destroy();
			}
		});
		return Promise.resolve();
	},
	addPiece: function (src, type, tunebook) {
		if (type === 'set') {
			var setTuneIds = src.get('tunes');
			this.models.forEach(function (piece) {
				if (setTuneIds.indexOf(piece.get('srcId')) > -1 && piece.get('tunebook') === 'wheresrhys:' + tunebook) {
					piece.destroy();
				}
			});
		}

		return this.add({
			srcId: src.id,
			type: type,
			tunebook: 'wheresrhys:' + tunebook
		}).save();
	},
	comparator: function (piece) {
		var timeAgo = (now - new Date(piece.get('lastPracticed'))) / (24 * 60 * 60 * 1000);
		if (isNaN(timeAgo)) {
			return -100;
		}
		timeAgo = Math.round(timeAgo);
		var score = (-timeAgo / 2) +
			1 * piece.get('lastPracticeQuality') +
			-1 * piece.get('stickiness') +
			-1 * piece.getSrc().getQuality() / 2;
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
	getIdsByTunebook: function (opts) {
		if (tunebooksHash) {
			return tunebooksHash;
		}

		tunebooksHash = {};

		var setsCollection = require('./sets');
		var self = this;
		user.tunebooks.forEach(function (tunebook) {
			var idHashes = {
				tunes: {},
				sets: {},
				setTunes: {}
			};
			self.models.filter(function (piece) {
				return piece.get('tunebook') === 'wheresrhys:' + tunebook;
			}).forEach(function (piece) {

				idHashes[piece.get('type') + 's'][piece.get('srcId')] = true;
				if (piece.get('type') === 'set') {
					setsCollection.find(piece.get('srcId')).get('tunes').forEach(function(tuneId) {
						idHashes.setTunes[tuneId] = true;
					});
				}
			})
			tunebooksHash[tunebook] = {
				tunes: Object.keys(idHashes.tunes),
				sets: Object.keys(idHashes.sets),
				setTunes: Object.keys(idHashes.setTunes)
			}
		});

		return tunebooksHash;
	},

	isInTunebook: function (tunebook, id) {
		return 	tunebooksHash[tunebook].tunes.indexOf(id) > -1 ? 'tune' :
						tunebooksHash[tunebook].sets.indexOf(id) > -1 ? 'set' :
						tunebooksHash[tunebook].setTunes.indexOf(id) > -1 ? 'setTune' : false
	},

	getTunebooksForResource: function (model) {
		this.getIdsByTunebook();
		return user.tunebooks.map(function (tunebook) {
			return {
				name: tunebook,
				isListed: this.isInTunebook(tunebook, model.id)
			}
		}.bind(this));
	},

	isKnown: function (tuneId) {
		return this.getTunebooksForResource({id: tuneId}).some(function (listing) {
			return listing.isListed;
		})
	},
	getOrphanedTunes: function () {

		var tunesCollection = require('./tunes');
		var tuneIds = [];

		user.tunebooks.forEach(function (tunebook) {
			tunebook = this.getIdsByTunebook()[tunebook];
			tuneIds = tuneIds.concat(tunebook.tunes.filter(function (id) {
				return tunebook.setTunes.indexOf(id) === -1;
			}));
		}.bind(this));
		return tuneIds.map(function (id) {
			return tunesCollection.find(id);
		})
	},
	getGreedyTunes: function () {

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