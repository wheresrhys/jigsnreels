module.exports = function () {
	var pieces = require('../data/collections/pieces');
	var tunes = require('../data/collections/tunes');
	Promise.all([pieces.populate(), tunes.populate()])
			.then(function () {

				var view = new (require('../components/tune-list'))({
					tunes: tunes,
					parentEl: document.querySelector('main')
				});
				view.setAsCurrentPage();
			}).catch(function (err) {console.log(err)});
};