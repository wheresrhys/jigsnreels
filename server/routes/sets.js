require('es6-promise').polyfill();

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var SetModel = require('../models/set');
var TuneModel = require('../models/tune');

var noop = function () {};

exports.fetchAll = function (req, res) {
	SetModel.find({}).exec()
		.then(function (sets) {
			Promise.all(sets.map(SetModel.addTunes))
				.then(function (sets) {
					res.send(sets);
				})
				.then(noop, function (err) {
					res.setStatus(500).send(err);
				});
		});
};

exports.findById = function (req, res) {
	SetModel.findOne({
		_id: new ObjectId(req.params.id)
	}).exec()
		.then(SetModel.addTunes)
		.then(function (set) {
			res.send(set);
		})
		.then(noop, function (err) {
			res.setStatus(503).send(err);
		});
};

exports.add = function (req, res) {
	SetModel.create(req.body)
		.then(function (set) {
			return SetModel.addPiece(set)
				.then(function (set) {
					res.send(set);
				});
		})
		.then(noop, function (err) {
			res.setStatus(503).send(err);
		});
};

exports.update = function (req, res) {
	delete req.body._id;
	SetModel.update({
		_id: new ObjectId(req.params.id)
	}, req.body, {}).exec()
		.then(function () {
			SetModel.findOne({
				_id: new ObjectId(req.params.id)
			}).exec()
				.then(SetModel.addTunes)
				.then(function (set) {
					res.send(set);
				});
		})
		.then(noop, function (err) {
			res.setStatus(500).send(err);
		});
};

exports.delete = function (req, res) {
	SetModel.findOne({
		_id: new ObjectId(req.params.id)
	}).exec()
		.then(SetModel.cleanRemove)
		.then(function (set) {
			if (process.env.TEST) {
				res.send(set);
			} else {
				res.send({});
			}
		});
};


