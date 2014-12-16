var mongoose = require('mongoose');
var PieceModel = require('../piece');
var SetModel = require('../set');
var TuneModel = require('../tune');

var pieceSchema = module.exports = mongoose.Schema({
	type: String,
	srcId: mongoose.Schema.Types.ObjectId,
	lastPracticed: Date,
	stickiness: {type: Number, default: 0},
	completeness: {type: Number, default: 0},
	lastPracticeQuality: {type: Number, default: 0},
	tunebook: String
});

pieceSchema.statics.addResourceToPiece = function (piece) {

	piece = piece.toObject();
	if (piece.type === 'set') {
		return SetModel.getWithTunes(piece.srcId)
			.then(function (set) {
				piece.src = set;
				return piece;
			});
	} else if (piece.type === 'tune') {

		return TuneModel.findOne({
			_id: piece.srcId
		}).exec()
			.then(function (tune) {
				piece.src = tune;
				return piece;
			});
	}
};