require('es6-promise').polyfill();

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var SetModel = require('../models/set');
var TuneModel = require('../models/tune');

exports.fetchAll = function (req, res) {
	SetModel.find({}, function (err, sets) {
		return Promise.all(sets.map(function (set) {
			return Promise.all(set.tunes.map(function (arr) {
				return new Promise(function (resolve, reject) {
					TuneModel.findOne({
						_id: new ObjectId(tune._id)
					}, function (err, tune) {
						if (err) {
							reject(err);
						} else {
							resolve(tune);
						}
					});
				}).then(function (tune) {
					arr.name = tune.name
					return arr;
				});
			})).then(function (tunes) {
				set.tunes = tunes
				return set;
			});

		})).then(function (sets) {
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
	SetModel.create(req.body, function (err, result) {
		res.send(result);
	});
};

exports.update = function (req, res) {
	delete req.body._id;
	SetModel.update({
		_id: new ObjectId(req.params.id)
	}, req.body, {}, function (err, num, result) {
		if (!err) {
			SetModel.findOne({
				_id: new ObjectId(req.params.id)
			}, function (err, result) {
				res.send(result);
			});
		}
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