var mongoose = require('mongoose'),
	transitionSchema = require('./schemas/transition');

module.exports = mongoose.model('Transition', transitionSchema);