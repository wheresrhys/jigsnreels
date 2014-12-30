var tunes = require('../collections/tunes');

var SetViewModel = module.exports = function (model) {
	if (!model) {
		return new SetViewModel(this);
	}
	this.model = model;
	this.out = this.model.toJSON();
	this.out.tunes = this.model.getTunes().map(function (model) {
		return model.viewModel();
	})
}

SetViewModel.prototype = {
	withTunebooks: function () {
		var pieces = require('../collections/pieces');
		this.out.tunebooks = pieces.getTunebooksForResource(this.model);
		this.out.tunes.forEach(function (tune) {
			tune.withTunebooks();
		});
		return this;
	},

	end: function (standalone) {
		this.out.tunes = this.out.tunes.map(function (tune) {
			return tune.end()
		});
		if (standalone) {
			return {
				locals: this.out
			};
		} else {
			return this.out;
		}
	}
}
