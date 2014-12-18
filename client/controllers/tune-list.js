module.exports = function () {
	var pieces = require('../data/collections/pieces');
	var tunes = require('../data/collections/tunes');
	var url = window.location.href;
	Promise.all([pieces.populate(), tunes.populate()])
		.then(function () {
			if (window.location.href !== url) return;

			var view = new (require('../components/tune-list'))({
				tunes: tunes,
				parentEl: document.querySelector('main')
			});
			view.setAsCurrentPage();
		}).catch(function (err) {console.log(err)});
};