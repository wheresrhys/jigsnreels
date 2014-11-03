JNR.models.Tune = Backbone.RelationalModel.extend({
	urlRoot: "/rest/tunes",
	relations: [
        {
            type: 'HasMany',
            key: 'performances',
            relatedModel: 'JNR.models.Performance',
			includeInJSON: false,
            reverseRelation: {
                key: 'tune'
            }
        }
    ],
	reallyDestroy: function() {
		this.performances.each(function (model) {
			model.destroy();
		})
		this.destroy();
	}
});
