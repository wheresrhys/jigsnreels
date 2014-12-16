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
	return !set.tunes.length ? Promise.resolve(set.toObject()) : Promise.all(set.tunes.map(function (tuneId) {
		return TuneModel.findOne({
			_id: tuneId
		}).exec();
	})).then(function (tunes) {
		set = set.toObject();
		set.tunes = tunes;
		return set;
	});
}

setSchema.statics.addPiece = function (set, tunebook) {
	PieceModel = require('../piece'); // re-require because circular

	return PieceModel.findOne({
		srcId: this._id,
		tunebook: 'wheresrhys:' + tunebook
	}).exec()
		.then(function (foundPiece) {
			return (foundPiece ? Promise.resolve(foundPiece) : PieceModel.create({
				srcId: set._id,
				type: 'set',
				tunebook: 'wheresrhys:' + tunebook
			})).then(function (piece) {
				set = set.toObject();
				set.piece = piece;
				return set;
			});
		});
}

setSchema.statics.cleanRemove = function (set) {
	return PieceModel.remove({
		srcId: set._id
	}).exec().then(function () {
		return set.remove();
	});
}

setSchema.statics.getWithTunes = function (setId) {
	return this.findOne({
		_id: setId
	}).exec().then(this.addTunes)
}

module.exports = setSchema;