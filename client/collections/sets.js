var Sets = require('exoskeleton').Collection.extend({
	url: require('../scaffolding/api').url('sets'),
	model: require('../models/set'),
	Presenter: require('./sets-presenter')
}, {});

module.exports = new Sets();