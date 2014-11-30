var tunes = require('../collections/tunes');
var sets = require('../collections/sets');

module.exports = require('../../scaffolding/presenter').extend({
	isPersistable: true,
	construct: function () {
		var self = this;
		var collection = (this.model.get('type') === 'set') ? sets : tunes;
		var srcId = this.model.get('srcId');
		this.srcModel = collection.models.filter(function (model) {
			return model.get('_id') === srcId;
		})[0]
	},
	toJSON: function (standalone) {
		
		var json = this.model.toJSON();
		json.src = this.srcModel.Presenter().toJSON();
		json.lastPracticed = json.lastPracticed && new Date(json.lastPracticed);
		json.lastPracticeQuality = json.lastPracticeQuality === -1 ? 'bad' :
									json.lastPracticeQuality === 1 ? 'good': 'neutral';
		json.isSticky = json.stickiness > 1;
		if (standalone) {
			return {
				locals: json
			};
		} else {
			return json;
		}
	}
});