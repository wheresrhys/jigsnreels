
module.exports = function (tunebook) {
	var pieces = require('../data/collections/pieces').get(tunebook);
	var piecesPromise = pieces.fetch({parse: true});
	var view = new (require('../components/practice-list'))({
		pieces: pieces,
		piecesPromise: piecesPromise,
		parentEl: document.querySelector('main')
	});
	view.setAsCurrentPage();
	localStorage.setItem('lastTunebook', tunebook);
};