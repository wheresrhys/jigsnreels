// var mongoose = require('mongoose');
var mongoose = require('mongoose-q')(require('mongoose'));
// var mongooseQ = require('mongoose-q')(mongoose);
var arrangementSchema = require('./arrangement');
var performanceSchema = require('./performance');

var tuneSchema = mongoose.Schema({
    sessionId: Number,
    name: String,
    abcId: mongoose.Schema.Types.ObjectId,
    abc: String,
    arrangements: [mongoose.Schema.Types.ObjectId],
    alternativeNames: [String],
    meters: [String],
    keys: [String],    
    rhythms: [String],
    quality: {type: Number, 'default': -1},
    popularity: {type: Number, 'default': -1},
    performances: [mongoose.Schema.Types.ObjectId],
    author: {type: String, 'default': 'trad arr.'}
});


tuneSchema.statics.createNewFromSession = function (tune) {
    var self = this;
    return this.findOneQ({sessionId: tune.sessionId }).then(function (foundTune) {
        return foundTune ? Promise.resolve(foundTune) : self.createQ(tune);
    });
};


tuneSchema.statics._flush = function () {
    return this.findQ({}).then(function (recs) {
        recs.forEach(function(rec) {
            rec.remove();
        });
    });
};

tuneSchema.index({ id: 1});
tuneSchema.index({ sessionId: 1});

module.exports = tuneSchema;