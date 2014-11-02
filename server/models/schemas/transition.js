var mongoose = require('mongoose'),
    arrangementSchema = require('./arrangement');

var transitionSchema = mongoose.Schema({
    tune1: arrangementSchema,
    tune2: arrangementSchema
});


// tuneSchema.statics.createNewFromSession = function (tune, callback) {
//     var self = this;
//     this.findOne({sessionId: tune.sessionId }, function (err, foundTune) {
//         if (!foundTune) {
//             foundTune = self.create(tune, function (err, newTune) {
//                 callback(newTune);
//             });
            
//         } else if (!foundTune.arrangements.length) {
//             callback(foundTune);
//         } else {
//             callback();
//         }
//     });
// };


// tuneSchema.statics._flush = function () {
//     this.find({}, function (e,recs) {
//         recs.forEach(function(rec) {
//             rec.remove();
//         });
//     });
// };

// tuneSchema.index({ id: 1});
// tuneSchema.index({ sessionId: 1});

module.exports = transitionSchema;