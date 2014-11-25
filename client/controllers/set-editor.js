var tunePromise;

module.exports = function (id) {
	var tunes = require('../collections/tunes');
    tunePromise = tunePromise || tunes.fetch();
	var view = new (require('../components/set-editor/view'))(tunePromise, document.querySelector('main'), id);
    view.setAsCurrentPage();
};