module.exports = require('../scaffolding/presenter').extend({
	
	toJSON: function (standalone) {
		var json = {
			sets: this.collection.models.slice(0, this.options.count).map(function (model) {
				return model.Presenter().toJSON();
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