module.exports = require('../scaffolding/presenter').extend({
	
	toJSON: function (standalone) {
		var json = {
			tunes: this.collection.models.slice(0, this.options.count).map(function (model) {
				return model.attributes;
			})
			// .map(function (model) {
			//     return new
			// })
		};

		if (standalone) {
			return {
				locals: json
			};
		} else {
			return json;
		}
	}
});