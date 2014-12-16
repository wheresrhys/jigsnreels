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
		this.out.tunebooks = require('../collections/pieces').getTunebooksForResource(this.model, 'set');
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
