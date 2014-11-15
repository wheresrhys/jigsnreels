var mongoose = require('mongoose-q')(require('mongoose'));

module.exports = mongoose.Schema({
    abc: String,
    variants: [String],
    meter: String,
    mode: String,    
    root: String,
    rhythm: String,
    author: {type: String, 'default': 'thesession'},
    tune: mongoose.Schema.Types.ObjectId
});