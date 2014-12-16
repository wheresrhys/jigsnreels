var tunes = require('../collections/tunes');
var sets = require('../collections/sets');

var PieceViewModel = module.exports = function (model) {
	if (!model) {
		return new SetViewModel(this);
	}
	this.model = model;
	this.out = this.model.toJSON();
	this.out.lastPracticed = this.out.lastPracticed && new Date(this.out.lastPracticed);
	this.out.lastPracticeQuality = this.out.lastPracticeQuality === -1 ? 'bad' :
																	this.out.lastPracticeQuality === 1 ? 'good': 'neutral';
	this.out.isSticky = this.out.stickiness > 1;
	this.promise = Promise.resolve();
}

PieceViewModel.prototype = {
	withSrc: function () {
		var collection = (this.model.get('type') === 'set') ? sets : tunes;
		var self = this;
		this.srcModel = collection.models.filter(function (model) {
			return model.id === self.model.srcId;
		})[0];

		this.promise = this.promise
			.then(function () {
				return self.srcModel.viewModel().end();
			})
			.then(function(srcViewModel) {
				self.out.src = srcViewModel;
			})

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
};