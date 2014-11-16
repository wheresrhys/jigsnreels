var tunes = require('../collections/tunes');

module.exports = require('../scaffolding/presenter').extend({
	isPersistable: true,
	toJSON: function (standalone) {
		var json = this.model.toJSON();
		json.tunes = this.model.get('tunes').map(function (tuneId) {
			return tunes.filter(function (tune) {
	            return tune.get('_id') === tuneId;
	        })[0].Presenter().toJSON();
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