var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var PracticeModel = require('../models/practice');
var SetModel = require('../models/set');
var TuneModel = require('../models/tune');


var addResourceToPractice = function (practice) {
    practice = practice.toObject();
    if (practice.type === 'set') {
        return SetModel.getWithTunes(practice.srcId).then(function (set) {
            practice.src = set;
            return practice;
        });
    } else if (practice.type === 'tune') {
        return TuneModel.findQ({
            _id: practice.srcId
        }).then(function (tune) {
            practice.src = tune;
            return practice;
        });
    }
}


exports.fetchAll = function (req, res) {
    PracticeModel.findQ({}).then(function (practices) {
        Promise.all(practices.map(addResourceToPractice)).then(function (practices) {
            res.send(practices);    
        })
    }).catch(function (err) {
        res.setStatus(500).send(err);
    });
};

exports.findById = function (req, res) {
    PracticeModel.findOne({
        _id: new ObjectId(req.params.id)
    }, function (err, result) {
        res.send(result);
    });
};

exports.add = function (req, res) {
    PracticeModel.create(req.body, function (err, result) {
        res.send(result);
    });
};

exports.update = function (req) {
    PracticeModel.update({
        _id: new ObjectId(req.params.id)
    }, req.body);
};

exports.delete = function (req, res) {
    PracticeModel.removeQ({
        _id: new ObjectId(req.params.id)
    }).then(function () {
        res.send({});
    }, function () {
        res.send({});
    });
};
