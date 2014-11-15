var realName = function (tune) {
	return tune.get('name').replace(/^(The|A) +/, '');
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
				return realName(a) > realName(b);
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