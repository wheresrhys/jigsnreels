var Sets = require('../../scaffolding/collection').extend({
	name: 'sets',
	url: require('../../scaffolding/api').url('sets'),
	model: require('../models/set'),
	populate: function () {
		return this.promise || (this.promise = this.fetch({parse: true}));
	}
}, {});

module.exports = new Sets();