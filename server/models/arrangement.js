var mongoose = require('mongoose'),
    arrangementSchema = require('./schemas/arrangement');

module.exports = mongoose.model('Arrangement', arrangementSchema);