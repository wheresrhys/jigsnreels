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
		var models = this.collection.models.sort(function (a, b) {
			return sortName(a) > sortName(b) ? 1: -1;
		})
		var self = this;

			

		if (this.options.by) {
			var hash = {};
			var by = this.options.by;
			models.forEach(function (tune) {
				tune.get(by + 's').forEach(function (group) {
					group = group.toLowerCase();
					hash[group] ? hash[group].push(tune) : (hash[group] = [tune]);	
				});
			});
			json.tunes = hash;
			json.types = Object.keys(hash).sort();
			if (this.options.sort) {
				Object.keys(hash).forEach(function (key) {
					hash[key] = hash[key].sort(self.options.sort).map(function (model) {
						return model.attributes;
					});
				})
			}
		} else {

			json.tunes = this.collection.models.slice().map(function (model) {
				return model.attributes;
			});
			if (this.options.sort) {
				json.tunes = json.tunes.sort(this.options.sort)
			}
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