var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var PieceModel = require('../models/piece');
var SetModel = require('../models/set');
var TuneModel = require('../models/tune');

var noop = function (){};

var addResourceToPiece = function (piece) {
	piece = piece.toObject();
	if (piece.type === 'set') {
		return SetModel.getWithTunes(piece.srcId)
			.then(function (set) {
				piece.src = set;
				return piece;
			});
	} else if (piece.type === 'tune') {
		return TuneModel.find({
			_id: piece.srcId
		}).exec()
			.then(function (tune) {
				piece.src = tune;
				return piece;
			});
	}
}


exports.fetchAll = function (req, res) {
	PieceModel.find({}).exec()
		.then(function (pieces) {
			return Promise.all(pieces.map(addResourceToPiece))
				.then(function (pieces) {
					res.send(pieces);
				})
		})
		.then(noop, function (err) {
			res.setStatus(500).send(err);
		});
};

exports.findById = function (req, res) {
	PieceModel.findOne({
		_id: new ObjectId(req.params.id)
	}).exec()
		.then(function (result) {
			res.send(result);
		});
};

exports.add = function (req, res) {
	PieceModel.create(req.body)
		.then(function (result) {
			res.send(result);
		});
};


exports.update = function (req, res) {
	delete req.body._id;

	req.body.lastPracticed = new Date(req.body.lastPracticed);

	PieceModel.update({
		_id: new ObjectId(req.params.id)
	}, req.body, {}).exec()
		.then(function () {
			return PieceModel.findOne({
				_id: new ObjectId(req.params.id)
			}).exec()
				.then(function (set) {
					res.send(set);
				});
		})
		.then(noop, function (err) {
			res.setStatus(500).send(err);
		});
};

exports.delete = function (req, res) {
	PieceModel.remove({
		_id: new ObjectId(req.params.id)
	}).exec()
		.then(function () {
			res.send({});
		}, function () {
			res.send({});
		});
};
