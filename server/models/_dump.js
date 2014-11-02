var mongoose = require('mongoose');

module.exports = mongoose.Schema({
    id: Number,
    sessionId: Number,
    tuneId: Number,
    name: String,
    myAbc: String,
    highestNote: String,
    lowestNote: String,
    standard: Number,
    updated: Number,
    notes: String,
    best: Number,
    difficulty: Number,
    lastPracticed: Number,
    specialAttention: Boolean,
    instrumentId: Number,
    ignore: Boolean 
});
