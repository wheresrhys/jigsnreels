var Practices = require('exoskeleton').Collection.extend({
    name: 'practices',
    url: require('../scaffolding/api').url('practices'),
	model: require('../models/practice'),
	Presenter: require('./practices-presenter')
}, {});

module.exports = new Practices();