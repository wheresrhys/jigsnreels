var mongoose = require('mongoose'),
    practiceSchema = require('./schemas/practice');

module.exports = mongoose.model('Practice', practiceSchema);

