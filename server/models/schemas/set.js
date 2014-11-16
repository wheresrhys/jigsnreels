var mongoose = require('mongoose-q')(require('mongoose'));
var transitionSchema = require('./transition');
var TuneModel = require('../tune');

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

setSchema.statics.getWithTunes = function (setId) {
    return this.findOneQ({
        _id: setId
    }).then(this.addTunes)
}

module.exports = setSchema;