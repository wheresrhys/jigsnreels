var swig = require('swig/index');
module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	events: {
//         "click .expand" : "expand",
// //      "click thead th ": "sort",
//         "click .view-switch": "viewSwitch",
// //      "click .new ": "newTune",
//         "keyup .filter" :  "filterTunes",
//         "keyup .search" :  "searchTunes"
	},
	initialize: function (practice, el) {
		this.practice = practice;
		this.parent = el;
		this.listenTo(this.practice, 'sync', this.render.bind(this));
		this.render();
	},

	render: function () {
		this.renderToDom(swig.render(this.tpl, this.practice.Presenter().toJSON(true)))
		return this;
	}
});