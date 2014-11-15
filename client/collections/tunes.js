var Tunes = require('exoskeleton').Collection.extend({
	url: require('../scaffolding/api').url('tunes'),
	model: require('../models/tune'),
	Presenter: require('./tunes-presenter')
}, {});

module.exports = new Tunes();