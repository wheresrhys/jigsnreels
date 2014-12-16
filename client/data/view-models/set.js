var tunes = require('../collections/tunes');
var pieces = require('../collections/pieces');

var SetViewModel = module.exports = function (model) {
	if (!model) {
		return new SetViewModel(this);
	}
	this.model = model;
	var self = this;
	this.out = this.model.toJSON();
	this.promise = Promise.all(this.model.get('tunes').map(function (tuneId) {
		return tunes.models.filter(function (tune) {
			return tune.get('_id') === tuneId;
		})[0].viewModel().end()

	}))
	.then(function(tunes) {
			self.out.tunes = tunes;
		});
}

SetViewModel.prototype = {
	withTunebooks: function () {
		var self = this;
		this.promise = this.promise.then(function () {
			return pieces.getTunebooksForResource(self.model)
		}).then(function (tunebooks) {
			self.out.tunebooks = tunebooks;
		});
		return this;
	},

	end: function (standalone) {
		return this.promise.then(function () {
			if (standalone) {
				return {
					locals: this.out
				};
			} else {
				return this.out;
			}
		}.bind(this))
	}
}
