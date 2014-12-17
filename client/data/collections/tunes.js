var Tunes = require('backbone-es6').Collection.extend({
	name: 'tunes',
	url: require('../../scaffolding/api').url('tunes'),
	model: require('../models/tune'),
	viewModel: require('../view-models/tunes'),
	populate: function () {
		return this.promise || (this.promise = this.fetch({parse: true}));
	}
}, {});

module.exports = new Tunes();