module.exports = require('../scaffolding/presenter').extend({
	
	toJSON: function (standalone) {
		var json = this.model.attributes;
        if (standalone) {
            return {
                locals: json
            };
        } else {
            return json;
        }
	}
});