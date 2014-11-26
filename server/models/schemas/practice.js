var mongoose = require('mongoose-q')(require('mongoose'));

module.exports = mongoose.Schema({
    type: String,
    srcId: mongoose.Schema.Types.ObjectId,
    lastPracticed: Date,
    stickiness: {type: Number, default: 0},
    completeness: {type: Number, default: 0},
    lastPracticeQuality: {type: Number, default: 0}
});