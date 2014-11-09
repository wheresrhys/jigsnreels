var swig = require('swig/index');
var proto = {
	tpl: require('./tpl.html'),
	events: {
//         "click .expand" : "expand",
// //      "click thead th ": "sort",
//         "click .view-switch": "viewSwitch",
// //      "click .new ": "newTune",
//         "keyup .filter" :  "filterTunes",
//         "keyup .search" :  "searchTunes"
	},
	initialize: function (sets, el) {
		this.sets = sets;
		this.parent = el;
		this.listenTo(this.sets, 'sync', this.render.bind(this));
		this.render();
	},

	render: function () {
		var frag = document.createDocumentFragment();
		frag.appendChild(document.createElement('div'));
		frag = frag.firstChild;
		frag.innerHTML = swig.render(this.tpl, this.sets.Presenter().toJSON());
		if (this.el.tagName === frag.firstChild.tagName && this.el.className === frag.firstChild.className) {
			this.el.innerHTML = '';
			while (frag.firstChild.firstChild) {
				this.el.appendChild(frag.firstChild.firstChild);
			}
		} else {
			this.setElement(frag.firstChild);
			this.parent.appendChild(this.el);
		}
		return this;
	}
};

module.exports = require('exoskeleton').NativeView.extend(proto);