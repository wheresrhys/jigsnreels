var practicesPromise;

module.exports = function () {
	var practices = require('../collections/practices');
	practicesPromise = practicesPromise || practices.fetch({parse: true});
	var view = new (require('../components/practice-list/view'))(practicesPromise, document.querySelector('main'));    
    view.setAsCurrentPage();
};