var tunes = require('../collections/tunes');
var sets = require('../collections/sets');

var PieceViewModel = module.exports = function (model) {
	if (!model) {
		return new PieceViewModel(this);
	}
	this.model = model;
	this.out = this.model.toJSON();
	this.out.tunebook = this.out.tunebook.split(':')[1];
	this.out.lastPracticed = this.out.lastPracticed && new Date(this.out.lastPracticed);
	this.out.lastPracticeQuality = this.out.lastPracticeQuality === -1 ? 'bad' :
																	this.out.lastPracticeQuality === 1 ? 'good': 'neutral';
	this.out.isSticky = this.out.stickiness > 1;
	this.promise = Promise.resolve();
}

PieceViewModel.prototype = {
	withSrc: function () {
		this.out.src = this.model.getSrc().viewModel().end();
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
};