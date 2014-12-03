var mongoose = require('mongoose');
var transitionSchema = require('./transition');
var TuneModel = require('../tune');
var PieceModel = require('../piece');

var setSchema = mongoose.Schema({
	name: String,
	tunes: [mongoose.Schema.Types.ObjectId],
	keys: [String]
});

setSchema.statics.addTunes = function (set) {
	if (process.env.TEST) {
		set = set.toObject();
		set.tunesAdded = true;

		return Promise.resolve(set);
	}
	return Promise.all(set.tunes.map(function (tuneId) {
		return TuneModel.findOne({
			_id: tuneId
		}).exec();
	})).then(function (tunes) {
		set = set.toObject();
		set.tunes = tunes;
		return set;
	});
}

setSchema.statics.addPiece = function (set) {
	if (process.env.TEST) {
		set = set.toObject();
		set.pieceAdded = true;
		return Promise.resolve(set);
	}
	return PieceModel.findOne({srcId: this._id }).exec().then(function (foundPiece) {
		return (foundPiece ? Promise.resolve(foundPiece) : PieceModel.create({
			srcId: set._id,
			type: 'set'
		})).then(function (piece) {
			set = set.toObject();
			set.piece = piece;
			return set;
		});
	});
}

setSchema.statics.cleanRemove = function (set) {
	if (process.env.TEST) {
		set = set.toObject();
		set.cleanlyRemoved = true;
		return Promise.resolve(set);
	}

	return PieceModel.remove({srcId: set._id }).exec().then(function () {
		return set.remove().exec();
	});
}

setSchema.statics.getWithTunes = function (setId) {
	return this.findOne({
		_id: setId
	}).exec().then(this.addTunes)
}

module.exports = setSchema;