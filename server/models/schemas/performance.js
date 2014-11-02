var mongoose = require('mongoose');

module.exports = mongoose.Schema({
    arrangement: mongoose.Schema.Types.ObjectId,
    tune: mongoose.Schema.Types.ObjectId,
    standard: Number,
    notes: String,
    best: Number,
    difficulty: Number,
    lastPracticed: Date,
    special: Boolean,
    instrument: String
});

