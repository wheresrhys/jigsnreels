module.exports = function () {
    var sets = require('../collections/sets');
    sets.fetch();
    new (require('../components/set-list/view'))(sets, document.querySelector('main'));
};