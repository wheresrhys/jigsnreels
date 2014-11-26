var tunesPromise;

module.exports = function (id) {
	var tunes = require('../collections/tunes');
    tunesPromise = tunesPromise || tunes.fetch();
	var view = new (require('../components/set-editor/view'))(tunesPromise, document.querySelector('main'), id);
    view.setAsCurrentPage();
};