module.exports = function (id) {
	var tunes = require('../collections/tunes');
	new (require('../components/set-editor/view'))(tunes.fetch(), document.querySelector('main'), id);
};