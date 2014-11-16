require('es6-promise').polyfill();

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var SetModel = require('../models/set');
var TuneModel = require('../models/tune');

var addTunesToSet = function (set) {
	return Promise.all(set.tunes.map(function (tuneId) {

		return TuneModel.findOneQ({
			_id: new ObjectId(tuneId)
		})
	})).then(function (tunes) {
		set = set.toObject();
		set.tunes = tunes;
		return set;
	});
}

exports.fetchAll = function (req, res) {
	SetModel.findQ({}).then(function (sets) {
		return Promise.all(sets.map(addTunesToSet)).then(function (sets) {
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
		console.log('set', typeof set.tunes[0],  set.tunes[0]);
		res.send(set);
	}).catch(function (err) {
		res.setStatus(500).send(err);
		setTimeout(function () {throw err})
	});
};

exports.update = function (req, res) {
	delete req.body._id;
	SetModel.updateQ({
		_id: new ObjectId(req.params.id)
	}, req.body, {}).then(function (num, result) {
		SetModel.findOneQ({
			_id: new ObjectId(req.params.id)
		}).then(addTunesToSet).then(function (set) {

			res.send(set);
		});
	}).catch(function (err) {
		res.setStatus(500).send(err);
	});
};

exports.delete = function (req, res) {
	// Set.findOne({
	//     _id: new ObjectId(req.params.id)
	// }, function (err, tune) {
	//     tune.performances.forEach(function (rec) {
	//         rec.remove();
	//     });
	//     tune.arrangements.forEach(function (rec) {
	//         rec.remove();
	//     });
	//     tune.remove();
	// });

};