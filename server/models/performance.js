var mongoose = require('mongoose'),
    performanceSchema = require('./schemas/performance');

module.exports = mongoose.model('Performance', performanceSchema);

