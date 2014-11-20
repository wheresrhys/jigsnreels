module.exports = function () {
	var practices = require('../collections/practices');
	practices.fetch({parse: true});
	new (require('../components/practice-list/view'))(practices, document.querySelector('main'));
};