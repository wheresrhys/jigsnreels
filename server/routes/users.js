require('es6-promise').polyfill();

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var UserModel = require('../models/user');

var noop = function () {};

exports.findByName = function (req, res) {
	UserModel.findOne({
		name: req.params.name
	}).exec()
		.then(function (user) {
			res.send(user);
		})
		.then(noop, function (err) {
			res.setStatus(503).send(err);
		});
};

exports.update = function (req, res) {
	delete req.body._id;
	UserModel.update({
		name: req.params.name
	}, req.body, {}).exec()
		.then(function () {
			UserModel.findOne({
				name: req.params.name
			}).exec()
				.then(function (user) {
					res.send(user);
				});
		})
		.then(noop, function (err) {
			res.setStatus(500).send(err);
		});
};