module.exports = function () {
	var practices = require('../collections/practices');
	practices.fetch();
	new (require('../components/practice-list/view'))(practices, document.querySelector('main'));
};