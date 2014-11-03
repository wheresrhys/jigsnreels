JNR.collections.InstrumentList = Backbone.Collection.extend({
	initialize: function () {
		this.add([
			{name: 'whistle', id: 1}, 
			{name: 'mandolin-gdad', id: 2}, 
			{name: 'mandolin-gdae', id: 3}
		])
	}
});
