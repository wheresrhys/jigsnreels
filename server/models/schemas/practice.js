var mongoose = require('mongoose');

module.exports = mongoose.Schema({
    type: String,
    srcId: mongoose.Schema.Types.ObjectId,
    lastPracticed: Number,
    stickiness: {type: Number, default: 0},
    completnness: {type: Number, default: 0}
});