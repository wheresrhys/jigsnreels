var tunes = require('../collections/tunes');
var pieces = require('../collections/pieces');

var TuneViewModel = module.exports = function (model) {
	if (!model) {
		return new TuneViewModel(this);
	}
	this.model = model;
	this.out = this.model.toJSON();
	this.promise = Promise.resolve();
}

TuneViewModel.prototype = {


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
