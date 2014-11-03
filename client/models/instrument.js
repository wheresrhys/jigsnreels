JNR.models.Instrument = Backbone.RelationalModel.extend({
//	urlRoot: "/rest/tunes",
//	initialize: function (attrs) {
//		var alt_names = this.get("alt_names");
//		this.set({
//			ear: !!this.get("ear"),
//			alt_names_string: (alt_names instanceof Array) ? alt_names.join(";"): alt_names
//		});
//		this.setPracticeStatus();
//		this.setRank();
//		if (!this.get("lowest_note")) {
//			this.saveABC();
//		}
//	},
//	relations: [
//        {
//            type: 'HasMany',
//            key: 'instrument_id',
//            relatedModel: 'JNR.models.Performance',
//            reverseRelation: {
//                key: 'instrument_id'
//            }
//        }
//    ]
});