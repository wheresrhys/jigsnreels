
module.exports = function (tunebook) {
	var pieces = require('../data/collections/pieces');
	pieces.fetch({parse: true})
		.then(function () {
			var view = new (require('../components/practice-list'))({
				pieces: pieces,
				tunebook: tunebook,
				parentEl: document.querySelector('main')
			});
			view.setAsCurrentPage();
			localStorage.setItem('lastTunebook', tunebook);
		});
};