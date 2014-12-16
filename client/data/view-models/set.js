var tunes = require('../collections/tunes');
var pieces = require('../collections/pieces');

var SetViewModel = module.exports = function (model) {
	this.model = model;
	this.out = this.model.toJSON();
	this.promise = Promise.resolve();
}

SetViewModel.prototype = {
	withTunes: function () {
		this.out.tunes = this.model.get('tunes').map(function (tuneId) {
			return tunes.filter(function (tune) {
				return tune.get('_id') === tuneId;
			})[0].Presenter().toJSON();
		});
		return this;
	},
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
