var mongoose = require('mongoose');

var userSchema = module.exports = mongoose.Schema({
	name: String,
	tunebooks: [String]
});

userSchema.index({ name: 1});