module.exports = function (id) {
	var tunes = require('../data/collections/tunes');
	var url = window.location.href;
	tunes.populate()
		.then(function () {
			if (window.location.href !== url) return;
			var view = new (require('../components/set-editor'))({
				tunes: tunes,
				parentEl: document.querySelector('main'),
				id: id
			});
			view.setAsCurrentPage();
		}).catch(function (err) {console.log(err)});
};