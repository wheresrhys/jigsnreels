var mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId,
    SetModel = require('../models/set');


exports.fetchAll = function (req, res) {
    SetModel.find({}, function (err, result) {
        res.send(result);
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