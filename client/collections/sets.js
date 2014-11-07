var Sets = require('exoskeleton').Collection.extend({
    url: require('../scaffolding/api').url('sets'),
    model: require('../models/set')
}, {});

module.exports = new Sets();