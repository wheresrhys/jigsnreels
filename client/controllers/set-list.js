var setsPromise;


module.exports = function () {
	var sets = require('../collections/sets');
	setsPromise = setsPromise || sets.fetch();
    var view = new (require('../components/set-list/view'))(sets, document.querySelector('main'));
    view.setAsCurrentPage();
};