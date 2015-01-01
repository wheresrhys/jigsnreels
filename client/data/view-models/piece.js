var tunes = require('../collections/tunes');
var sets = require('../collections/sets');

var now = new Date();
var user = window.user;

setTimeout(function () {
	now = new Date();
}, 1000);


function debug (piece) {
	var timeAgo = (now - new Date(piece.get('lastPracticed'))) / (24 * 60 * 60 * 1000);
	if (isNaN(timeAgo)) {
		return 0;
	}
	timeAgo = Math.round(timeAgo);
	var score = (-timeAgo / 2) +
		1 * piece.get('lastPracticeQuality') +
		-1 * piece.get('stickiness') +
		-1 * piece.getSrc().getQuality() / 2;
	return ['score', score, 'timeAgo', timeAgo, 'practice quality', piece.get('lastPracticeQuality'), 'quality', piece.getSrc().getQuality(), 'sticky', piece.get('stickiness')].join(',');
}

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
	if (window.DEBUG) {
		this.out.debug = debug(this.model);
	}
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