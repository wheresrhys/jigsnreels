var mongoose = require('mongoose');

var transitionSchema = mongoose.Schema({
    tune1: mongoose.Schema.Types.ObjectId,
    tune1Root: String,
    tune2: mongoose.Schema.Types.ObjectId,
    tune2Root: String,
});

module.exports = transitionSchema;