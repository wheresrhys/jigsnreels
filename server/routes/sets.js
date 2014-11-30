require('es6-promise').polyfill();

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var SetModel = require('../models/set');
var TuneModel = require('../models/tune');

exports.fetchAll = function (req, res) {
	SetModel.findQ({}).then(function (sets) {
		Promise.all(sets.map(SetModel.addTunes)).then(function (sets) {
			res.send(sets);    
		}).catch(function (err) {
			res.setStatus(500).send(err);
		});
	});
};

exports.findById = function (req, res) {
	SetModel.findOne({
		_id: new ObjectId(req.params.id)
	}, function (err, result) {
		res.send(result);
	});
};

exports.add = function (req, res) {
	SetModel.createQ(req.body).then(function (set) {
		SetModel.addPiece(set).then(function (set) {
			res.send(set);	
		});
	}).catch(function (err) {
		res.setStatus(500).send(err);
		setTimeout(function () {throw err})
	});
};

exports.update = function (req, res) {
	delete req.body._id;
	SetModel.updateQ({
		_id: new ObjectId(req.params.id)
	}, req.body, {}).then(function () {
		SetModel.findOneQ({
			_id: new ObjectId(req.params.id)
		}).then(SetModel.addTunes).then(function (set) {
			res.send(set);
		});
	}).catch(function (err) {
		res.setStatus(500).send(err);
	});
};

exports.delete = function (req, res) {
	SetModel.findOneQ({
		_id: new ObjectId(req.params.id)
	})
	.then(SetModel.cleanRemove)
	.then(function (set) {
		res.send({});
	});

};