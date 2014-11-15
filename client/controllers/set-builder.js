module.exports = function () {
	var tunes = require('../collections/tunes');
	tunes.fetch();
	new (require('../components/set-builder/view'))(tunes, document.querySelector('main'));
};