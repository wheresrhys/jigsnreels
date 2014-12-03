var mongoose = require('mongoose'),
	ObjectId = mongoose.Types.ObjectId,
	TuneModel = require('../models/tune');


exports.fetchAll = function (req, res) {
	TuneModel.find({}, function (err, result) {
		res.send(result);
	});
};

exports.findById = function (req, res) {
	TuneModel.findOne({
		_id: new ObjectId(req.params.id)
	}, function (err, result) {
		res.send(result);
	});
};

exports.add = function (req, res) {
	TuneModel.create(req.body, function (err, result) {
		res.send(result);
	});
};

exports.update = function (req, res) {
	delete req.body._id;
	TuneModel.update({
		_id: new ObjectId(req.params.id)
	}, req.body, {}, function (err, num, result) {
		if (!err) {
			TuneModel.findOne({
				_id: new ObjectId(req.params.id)
			}, function (err, result) {
				res.send(result);
			});
		}
	});

};

exports.delete = function (req, res) {
	// Tune.findOne({
	//	 _id: new ObjectId(req.params.id)
	// }, function (err, tune) {
	//	 tune.performances.forEach(function (rec) {
	//		 rec.remove();
	//	 });
	//	 tune.arrangements.forEach(function (rec) {
	//		 rec.remove();
	//	 });
	//	 tune.remove();
	// });

};