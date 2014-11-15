module.exports = require('../scaffolding/presenter').extend({
	
	toJSON: function (standalone) {
		var json = this.model.attributes;
		var tunes = json.tunes.map(function (tune) {
			return tune.Presenter().toJSON();
		});
		json = JSON.parse(JSON.stringify(this.model.attributes));
		json.tunes = tunes;
		if (standalone) {
			return {
				locals: json
			};
		} else {
			return json;
		}
	}
});