var tunes = require('../collections/tunes');
var sets = require('../collections/sets');

var PieceViewModel = module.exports = function (model) {
	if (!model) {
		return new PieceViewModel(this);
	}
	this.model = model;
	this.isCorrectResource = this.isCorrectResource.bind(this);
	this.out = this.model.toJSON();
	this.out.lastPracticed = this.out.lastPracticed && new Date(this.out.lastPracticed);
	this.out.lastPracticeQuality = this.out.lastPracticeQuality === -1 ? 'bad' :
																	this.out.lastPracticeQuality === 1 ? 'good': 'neutral';
	this.out.isSticky = this.out.stickiness > 1;
	this.promise = Promise.resolve();
}

PieceViewModel.prototype = {
	withSrc: function () {
		var collection = (this.model.get('type') === 'set') ? require('../collections/sets') : require('../collections/tunes');
		this.out.src = collection.models.filter(this.isCorrectResource)[0].viewModel().end();;
		return this;
	},

	isCorrectResource: function (model) {
		return model.id === this.model.get('srcId');
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