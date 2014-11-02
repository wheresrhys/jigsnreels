var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId,
    Performance = require('../models/performance');

exports.fetchAll = function (req, res) {
    Performance.find({}, function (err, result) {
        res.send(result);
    });
};

exports.findById = function (req, res) {
    Performance.findOne({
        _id: new ObjectId(req.params.id)
    }, function (err, result) {
        res.send(result);
    });
};

exports.add = function (req, res) {
    Performance.create(req.body, function (err, result) {
        res.send(result);
    });
};

exports.update = function (req) {
    Performance.update({
        _id: new ObjectId(req.params.id)
    }, req.body);
};

exports.delete = function (req, res) {
    Performance.remove({
        _id: new ObjectId(req.params.id)
    });
};
