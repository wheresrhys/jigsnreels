module.exports = function () {
	var pieces = require('../data/collections/pieces');
	var sets = require('../data/collections/sets');
	var url = window.location.href;

	Promise.all([pieces.populate(), sets.populate()])
		.then(function () {
			if (window.location.href !== url) return;
			var view = new (require('../components/set-list'))({
				sets: sets,
				parentEl: document.querySelector('main')
			});
			view.setAsCurrentPage();
		}).catch(function (err) {console.log(err)});
};