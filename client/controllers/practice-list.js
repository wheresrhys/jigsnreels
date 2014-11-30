var practicesPromise;

module.exports = function () {
	var practices = require('../data/collections/practices');
	practicesPromise = practicesPromise || practices.fetch({parse: true});
	var view = new (require('../components/practice-list/view'))({
        practicesPromise: practicesPromise, 
        parentEl: document.querySelector('main')
    });    
    view.setAsCurrentPage();
};