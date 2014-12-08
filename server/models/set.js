var mongoose = require('mongoose'),
	setSchema = require('./schemas/set');

module.exports = mongoose.model('Set', setSchema);