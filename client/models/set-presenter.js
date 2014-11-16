var tunes = require('../collections/tunes');

module.exports = require('../scaffolding/presenter').extend({
	isPersistable: true,
	toJSON: function (standalone) {
		var json = {};
		json.tunes = this.model.get('tunes').map(function (tuneId) {
			return tunes.filter(function (tune) {
	            return tune.get('_id') === tuneId;
	        })[0].Presenter().toJSON();
		});
		json.keys = this.model.get('keys');

		if (standalone) {
			return {
				locals: json
			};
		} else {
			return json;
		}
	}
});