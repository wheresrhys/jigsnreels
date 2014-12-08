var Sets = require('backbone-es6').Collection.extend({
	name: 'sets',
	url: require('../../scaffolding/api').url('sets'),
	model: require('../models/set'),
	Presenter: require('./sets-presenter')
}, {});

module.exports = new Sets();