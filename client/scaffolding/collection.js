var find = function (filter, value) {
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

	for(var i= 0, il = this.length; i < il; i++) {
		if (filter(this[i])) {
			return this[i];
		}
	}
}
module.exports = require('backbone-es6').Collection.extend({
	find: function () {
		return find.apply(this.models, arguments);
	}
});