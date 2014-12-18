module.exports = function (tunebook) {
	var pieces = require('../data/collections/pieces');
	var url = window.location.href;
	pieces.populate()
		.then(function () {
			if (window.location.href !== url) return;
			var view = new (require('../components/practice-list'))({
				pieces: pieces,
				tunebook: tunebook,
				parentEl: document.querySelector('main')
			});
			view.setAsCurrentPage();
			localStorage.setItem('lastTunebook', tunebook);
		}).catch(function (err) {console.log(err)});
};