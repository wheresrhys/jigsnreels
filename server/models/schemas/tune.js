// var mongoose = require('mongoose');
var mongoose = require('mongoose');
// var mongooseQ = require('mongoose-q')(mongoose);
var arrangementSchema = require('./arrangement');

var tuneSchema = mongoose.Schema({
	sessionId: {type: Number, 'default': 0},
	oldId: mongoose.Schema.Types.ObjectId,
	name: String,
	abcId: mongoose.Schema.Types.ObjectId,
	abc: String,
	arrangements: [mongoose.Schema.Types.ObjectId],
	meters: [String],
	keys: [String],
	rhythms: [String],
	quality: {type: Number, 'default': -1},
	author: {type: String, 'default': 'trad arr.'}
});


tuneSchema.statics.createNewFromSession = function (tune) {
	var it = this;
	return this.findOne({sessionId: tune.sessionId }).exec().then(function (foundTune) {
		return foundTune ? Promise.resolve(foundTune) : it.create(tune);
	});
};

tuneSchema.index({ id: 1});
// tuneSchema.index({ sessionId: 1});

module.exports = tuneSchema;