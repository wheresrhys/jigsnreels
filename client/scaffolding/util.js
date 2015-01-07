'use strict';

module.exports = {
	find: function (haystack, filter, value) {
		if (typeof filter !== 'function') {
			if (!value) {
				value = filter;
				filter = function (model) {
					return model.id === value;
				}
			} else {
				var prop = filter;
				filter = function (model) {
					return model.get(prop) === value;
				}
			}
		}

		if (!(haystack instanceof Array)) {
			haystack = haystack.models;
		}

		for(var i= 0, il = haystack.length; i < il; i++) {
			if (filter(haystack[i])) {
				return haystack[i];
			}
		}
	}
}