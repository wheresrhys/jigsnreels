'use strict';

module.exports = require('backbone-es6').Model.extend({
	idAttribute: '_id',
	url: function () {
		return require('../../scaffolding/api').url('tunes', this.id);
	},
	Presenter: require('./tune-presenter')
}, {});