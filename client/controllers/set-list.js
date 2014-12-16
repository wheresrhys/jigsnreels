var setsPromise;

module.exports = function () {
	var sets = require('../data/collections/sets');
	setsPromise = setsPromise || sets.fetch();
	var view = new (require('../components/set-list'))({
		sets: sets,
		parentEl: document.querySelector('main')
	});
	view.setAsCurrentPage();
};