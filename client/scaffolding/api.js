'use strict';

// List of API URLs.
var URLs = {
	tunes: function (id) {
		return '/api/tunes' + (id ? '/' + id : '');
	},
	sets: function (id) {
		return '/api/sets' + (id ? '/' + id : '');
	},
	practices: function (id) {
		return '/api/practices' + (id ? '/' + id : '');
	}
};

exports.url = function (type) {
	return URLs[type] && URLs[type].apply(this, [].slice.call(arguments, 1));
};