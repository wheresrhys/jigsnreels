var sortName = function (tune) {
	return tune.get('name').replace(/^(The|A) +/i, '').toLowerCase();
};

var logTuneNames =function (tunes) {
	console.log(tunes && tunes.map(function (tune) {
		return tune.get('name')
	}));
}

module.exports = require('../scaffolding/presenter').extend({
	construct: function () {

	},
	toJSON: function (standalone) {
		
		var json = {};

		if (this.options.by) {
			var hash = {};
			var by = this.options.by;
			this.collection.models.sort(function (a, b) {
				return sortName(a) > sortName(b) ? 1: -1;
			}).forEach(function (tune) {
				tune.get(by + 's').forEach(function (group) {
					hash[group] ? hash[group].push(tune) : (hash[group] = [tune]);	
				});
			});
			json.tunes = hash;
			json.types = Object.keys(hash).sort();
		} else {

			json.tunes = this.collection.models.slice().map(function (model) {
				return model.attributes;
			});
		}

		if (standalone) {
			return {
				locals: json
			};
		} else {
			return json;
		}
	}
});