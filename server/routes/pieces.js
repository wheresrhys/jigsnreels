var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var PieceModel = require('../models/piece');
var SetModel = require('../models/set');
var TuneModel = require('../models/tune');

var noop = function (){};


exports.fetchAll = function (req, res) {
	var criteria = req.query.tunebook ? {
		tunebook: 'wheresrhys:' + req.query.tunebook
	} : {};
	PieceModel.find(criteria).exec()
		.then(function (pieces) {
			return Promise.all(pieces.map(PieceModel.addResourceToPiece))
				.then(function (pieces) {
					res.send(pieces);
				})
		})
		.then(noop, function (err) {
			res.setStatus(503).send(err);
		});
};

exports.findById = function (req, res) {

	PieceModel.findOne({
		_id: new ObjectId(req.params.id)
	}).exec()
		.then(PieceModel.addResourceToPiece)
		.then(function (piece) {
			res.send(piece);
		})
		.then(noop, function (err) {
			res.setStatus(503).send(err);
		});
};

exports.add = function (req, res) {
	PieceModel.create(req.body)
		.then(PieceModel.addResourceToPiece)
		.then(function (piece) {
			res.send(piece);
		})
		.then(noop, function (err) {
			res.setStatus(503).send(err);
		});
};


exports.update = function (req, res) {
	delete req.body._id;

	req.body.lastPracticed = new Date();

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
			res.setStatus(503).send(err);
		});
};

exports.delete = function (req, res) {
	PieceModel.remove({
		_id: new ObjectId(req.params.id)
	}).exec()
		.then(function () {
			res.send({});
		})
		.then(noop, function (err) {
			res.setStatus(503).send(err);
		});
};
