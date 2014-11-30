var Tunes = require('backbone-es6').Collection.extend({
    name: 'tunes',
	url: require('../../scaffolding/api').url('tunes'),
	model: require('../models/tune'),
	Presenter: require('./tunes-presenter')
}, {});

module.exports = new Tunes();