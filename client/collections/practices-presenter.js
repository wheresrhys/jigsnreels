module.exports = require('../scaffolding/presenter').extend({
	
	toJSON: function (standalone) {
		var json = {
			// practices: this.collection.models.slice().map(function (model) {
			// 	return model.Presenter().toJSON();
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