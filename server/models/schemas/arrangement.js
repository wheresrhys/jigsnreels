var mongoose = require('mongoose');

module.exports = mongoose.Schema({
    abc: String,
    highestNote: String,
    lowestNote: String,
    variants: String,
    root: String,
    author: {type: String, 'default': 'thesession'},
    src: mongoose.Schema.ObjectId,
    tune: mongoose.Schema.Types.ObjectId
});