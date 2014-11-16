var mongoose = require('mongoose-q')(require('mongoose'));
var arrangementSchema = require('./arrangement');
var transitionSchema = require('./transition');

var setSchema = mongoose.Schema({
    name: String,
    tunes: [mongoose.Schema.Types.ObjectId],
    keys: [String]
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

module.exports = setSchema;