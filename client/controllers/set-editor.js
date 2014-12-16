var tunesPromise;

module.exports = function (id) {
	var tunes = require('../data/collections/tunes');
	tunesPromise = tunesPromise || tunes.fetch();
	var view = new (require('../components/set-editor'))({
		tunesPromise: tunesPromise,
		parentEl: document.querySelector('main'),
		id: id
	});
	view.setAsCurrentPage();
};