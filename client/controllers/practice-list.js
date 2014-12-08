var piecesPromise;

module.exports = function () {
	var pieces = require('../data/collections/pieces');
	piecesPromise = piecesPromise || pieces.fetch({parse: true});
	var view = new (require('../components/practice-list/view'))({
		piecesPromise: piecesPromise,
		parentEl: document.querySelector('main')
	});
	view.setAsCurrentPage();
};