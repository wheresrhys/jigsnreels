var TuneViewModel = module.exports = function (model) {
	if (!model) {
		return new TuneViewModel(this);
	}
	this.model = model;
	this.out = this.model.toJSON();
}

TuneViewModel.prototype = {
	withTunebooks: function (idsHash) {
		this.out.tunebooks = require('../collections/pieces').getTunebooksForResource(this.model, idsHash);
		return this;
	},
	end: function (standalone) {
		if (standalone) {
			return {
				locals: this.out
			};
		} else {
			return this.out;
		}
	}
}
