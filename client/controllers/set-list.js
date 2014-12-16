var setsPromise;

module.exports = function () {
	var sets = require('../data/collections/sets');
	var tunebooks = require('../data/collections/pieces').getAll(true);
	Promise.all(tunebooks.concat(sets.fetch()))
			.then(function () {
				var view = new (require('../components/set-list'))({
					sets: sets,
					parentEl: document.querySelector('main')
				});
				view.setAsCurrentPage();
			});
};