module.exports = require('exoskeleton').Collection.extend({
    url: require('../scaffolding/api').url('sets'),
    model: require('../models/set')
}, {});