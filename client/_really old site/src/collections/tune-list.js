JNR.collections.TuneList = Backbone.Collection.extend({
	model: JNR.models.Tune,
	url : "/rest/tunes",
	getDummyPerformances: function (number) {
		var tunes = this.filter(function(model) {
			return _.map(model.get('performances').models, function (performance) {
				return performance.get('instrument_id');
			}).indexOf(JNR.app.instrumentId) === -1;
		})
		tunes = _.first(_.sortBy(tunes, function () {
			return Math.random()
		}), number);
		return _.map(tunes, this.getDummyPerformance);
	},
	getDummyPerformance: function (tune) {

		var performance =  new JNR.models.Performance({
			instrument_id: JNR.app.instrumentId,
			tune: tune,
			my_abc: tune.get('my_abc') || tune.get('session_abc')
		},{
			dummy: true
		});

		return performance;
	}
});
