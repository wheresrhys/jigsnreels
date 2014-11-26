// var mongoose = require('mongoose');
var mongoose = require('mongoose-q')(require('mongoose'));
// var mongooseQ = require('mongoose-q')(mongoose);
var arrangementSchema = require('./arrangement');

var tuneSchema = mongoose.Schema({
    sessionId: {type: Number, 'default': 0},
    oldId: mongoose.Schema.Types.ObjectId,
    name: String,
    abcId: mongoose.Schema.Types.ObjectId,
    abc: String,
    arrangements: [mongoose.Schema.Types.ObjectId],
    meters: [String],
    keys: [String],    
    rhythms: [String],
    quality: {type: Number, 'default': -1},
    author: {type: String, 'default': 'trad arr.'},
    genre: {type: String, 'default': 'trad'}
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
// tuneSchema.index({ sessionId: 1});

module.exports = tuneSchema;