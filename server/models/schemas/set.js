var mongoose = require('mongoose-q')(require('mongoose'));
var transitionSchema = require('./transition');
var TuneModel = require('../tune');
var PracticeModel = require('../practice');

var setSchema = mongoose.Schema({
    name: String,
    tunes: [mongoose.Schema.Types.ObjectId],
    keys: [String]
});

setSchema.statics.addTunes = function (set) {
    return Promise.all(set.tunes.map(function (tuneId) {
        return TuneModel.findOneQ({
            _id: tuneId
        })
    })).then(function (tunes) {
        set = set.toObject();
        set.tunes = tunes;
        return set;
    });
}

setSchema.statics.addPractice = function (set) {
    return PracticeModel.findOneQ({srcId: this._id }).then(function (foundPractice) {
        return (foundPractice ? Promise.resolve(foundPractice) : PracticeModel.createQ({
            srcId: set._id,
            type: 'set'
        })).then(function (practice) {
            set = set.toObject();
            set.practice = practice;
            return set;
        });
    });
}

setSchema.statics.cleanRemove = function (set) {
    return PracticeModel.removeQ({srcId: set._id }).then(function () {
        return set.removeQ();
    });    
}

setSchema.statics.getWithTunes = function (setId) {
    return this.findOneQ({
        _id: setId
    }).then(this.addTunes)
}

module.exports = setSchema;