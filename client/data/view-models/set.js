var tunes = require('../collections/tunes');

var SetViewModel = module.exports = function (model) {
	if (!model) {
		return new SetViewModel(this);
	}
	this.model = model;
	this.out = this.model.toJSON();
	this.out.tunes = this.model.get('tunes').map(function (tuneId) {
		return tunes.models.filter(function (tune) {
			return tune.get('_id') === tuneId;
		})[0].viewModel();
	})
}

SetViewModel.prototype = {
	withTunebooks: function () {
		var pieces = require('../collections/pieces');
		var idsHash = pieces.getIdsByTunebook();
		this.out.tunebooks = pieces.getTunebooksForResource(this.model, idsHash);
		this.out.tunes.forEach(function (tune) {
			tune.withTunebooks(idsHash);
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
