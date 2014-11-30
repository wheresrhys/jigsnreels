var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var PieceModel = require('../models/piece');
var SetModel = require('../models/set');
var TuneModel = require('../models/tune');


var addResourceToPiece = function (piece) {
	piece = piece.toObject();
	if (piece.type === 'set') {
		return SetModel.getWithTunes(piece.srcId).then(function (set) {
			piece.src = set;
			return piece;
		});
	} else if (piece.type === 'tune') {
		return TuneModel.findQ({
			_id: piece.srcId
		}).then(function (tune) {
			piece.src = tune;
			return piece;
		});
	}
}


exports.fetchAll = function (req, res) {
	PieceModel.findQ({}).then(function (pieces) {
		Promise.all(pieces.map(addResourceToPiece)).then(function (pieces) {
			res.send(pieces);    
		})
	}).catch(function (err) {
		res.setStatus(500).send(err);
	});
};

exports.findById = function (req, res) {
	PieceModel.findOne({
		_id: new ObjectId(req.params.id)
	}, function (err, result) {
		res.send(result);
	});
};

exports.add = function (req, res) {
	PieceModel.create(req.body, function (err, result) {
		res.send(result);
	});
};


exports.update = function (req, res) {
	delete req.body._id;
	req.body.lastPieced = new Date(req.body.lastPieced);
	PieceModel.updateQ({
		_id: new ObjectId(req.params.id)
	}, req.body, {}).then(function () {
		PieceModel.findOneQ({
			_id: new ObjectId(req.params.id)
		}).then(function (set) {
			res.send(set);
		});
	}).catch(function (err) {
		res.setStatus(500).send(err);
	});
};

exports.delete = function (req, res) {
	PieceModel.removeQ({
		_id: new ObjectId(req.params.id)
	}).then(function () {
		res.send({});
	}, function () {
		res.send({});
	});
};
