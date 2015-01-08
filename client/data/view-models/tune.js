var TuneViewModel = module.exports = function (model) {
	if (!model) {
		return new TuneViewModel(this);
	}
	this.model = model;
	this.out = this.model.toJSON();
	if (window.DEBUG) {
		this.out.name = this.out.name.replace('SAFESAFESAFE', '');
	}
}

TuneViewModel.prototype = {
	withTunebooks: function () {
		var pieces = require('../collections/pieces');
		this.out.tunebooks = pieces.getTunebooksForResource(this.model);
		return this;
	},
	withPiece: function () {
		var pieces = require('../collections/pieces');
		this.out.piece = pieces.find('srcId', this.out._id).toJSON();
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
