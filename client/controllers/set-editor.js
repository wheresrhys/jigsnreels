module.exports = function (id) {
	var tunes = require('../collections/tunes');
	tunes.fetch();
	new (require('../components/set-editor/view'))(tunes, document.querySelector('main'), id);
};