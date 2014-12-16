'use strict';

// List of API URLs.
var URLs = {
	tunes: function (id) {
		return '/api/tunes' + (id ? '/' + id : '');
	},
	// tune: function(id) {
	//   return '/api/tunes/'+ id;
	// },
	sets: function (id) {
		return '/api/sets' + (id ? '/' + id : '');
	},
	pieces: function (id, tunebook) {
		return '/api/pieces' + (id ? '/' + id : '') + (tunebook ? '?tunebook=' + tunebook : '');
	}
};

// Helper for accessing the URL list. Think of it as something similar
// to Rails' URL helpers.
exports.url = function (type) {
	return URLs[type] && URLs[type].apply(this, [].slice.call(arguments, 1));
};