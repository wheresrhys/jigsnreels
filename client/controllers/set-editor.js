var tunesPromise;

module.exports = function (id) {
	var tunes = require('../data/collections/tunes');
	tunes.fetch().then(function () {
		var view = new (require('../components/set-editor'))({
			tunes: tunes,
			parentEl: document.querySelector('main'),
			id: id
		});
		view.setAsCurrentPage();
	});
};