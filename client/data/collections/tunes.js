var Tunes = require('backbone-es6').Collection.extend({
	name: 'tunes',
	url: require('../../scaffolding/api').url('tunes'),
	model: require('../models/tune'),
	viewModel: require('../view-models/tunes')
}, {});

module.exports = new Tunes();