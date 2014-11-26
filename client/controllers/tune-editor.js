module.exports = function (id) {
	var view = new (require('../components/tune-editor/view'))(document.querySelector('main'), id);
	view.setAsCurrentPage();
};