module.exports = require('../scaffolding/presenter').extend({
	isPersistable: true,
	toJSON: function (standalone) {
		var json = {};
		json.tunes = this.model.get('tunes').map(function (tune) {
			return tune.Presenter().toJSON();
		});
		if (standalone) {
			return {
				locals: json
			};
		} else {
			return json;
		}
	}
});