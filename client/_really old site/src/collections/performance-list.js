JNR.collections.PerformanceList = Backbone.Collection.extend({
    model: JNR.models.Performance,
	url : "/rest/performances",
//	comparator: function (model) {
//		return -model.get("practiceUrgency");
//	},
	properlyInitialise: function () {
		this.each(function (model) {
			model.afterDataPopulate();
		})
	}
});
