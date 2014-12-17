module.exports = function () {
	var pieces = require('../data/collections/pieces');
	var sets = require('../data/collections/sets');
	Promise.all([pieces.populate(), sets.populate()])
			.then(function () {

				var view = new (require('../components/set-list'))({
					sets: sets,
					parentEl: document.querySelector('main')
				});
				view.setAsCurrentPage();
			}).catch(function (err) {console.log(err)});
};