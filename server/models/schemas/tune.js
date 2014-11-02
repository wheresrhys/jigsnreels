var mongoose = require('mongoose'),
    arrangementSchema = require('./arrangement'),
    performanceSchema = require('./performance');

var tuneSchema = mongoose.Schema({
    sessionId: Number,
    name: String,
    arrangements: [arrangementSchema],
    alternativeNames: [String],
    meter: String,
    mode: String,
    rhythm: String,
    rating: {type: Number, 'default': -1},
    popularity: {type: Number, 'default': -1},
    performances: [performanceSchema],
    notes: String
});


tuneSchema.statics.createNewFromSession = function (tune, callback) {
    var self = this;
    this.findOne({sessionId: tune.sessionId }, function (err, foundTune) {
        if (!foundTune) {
            foundTune = self.create(tune, function (err, newTune) {
                callback(newTune);
            });
            
        } else if (!foundTune.arrangements.length) {
            callback(foundTune);
        } else {
            callback();
        }
    });
};


tuneSchema.statics._flush = function () {
    this.find({}, function (e,recs) {
        recs.forEach(function(rec) {
            rec.remove();
        });
    });
};

tuneSchema.index({ id: 1});
tuneSchema.index({ sessionId: 1});

module.exports = tuneSchema;