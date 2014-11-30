var tunesPromise;

module.exports = function (id) {
	var tunes = require('../collections/tunes');
    tunesPromise = tunesPromise || tunes.fetch();
	var view = new (require('../components/set-editor/view'))({
        tunesPromise: tunesPromise,
        parentEl: document.querySelector('main'), 
        id: id
    });
    view.setAsCurrentPage();
};