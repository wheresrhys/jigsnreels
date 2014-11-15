var swig = require('swig/index');
var proto = {
	tpl: require('./tpl.html'),
	events: {
        'change .set-builder__tune-selector': 'appendTune'
// //      "click thead th ": "sort",
//         "click .view-switch": "viewSwitch",
// //      "click .new ": "newTune",
//         "keyup .filter" :  "filterTunes",
//         "keyup .search" :  "searchTunes"
	},

	initialize: function (tunes, el) {
		this.allTunes = tunes;
		this.parent = el;
		this.set = new (require('../../models/set'))();
		this.listenTo(this.allTunes, 'sync', this.render.bind(this));
		this.listenTo(this.set, 'change', this.render.bind(this));
		this.render();
	},

	render: function () {
		var frag = document.createDocumentFragment();
		frag.appendChild(document.createElement('div'));
		frag = frag.firstChild;
		frag.innerHTML = swig.render(this.tpl, {
			locals: {
				set: this.set.Presenter({persist: true}).toJSON(),
				tunes: this.allTunes.Presenter({persist: false}).toJSON().tunes
			}
		});
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
	},

	appendTune: function () {
		var select = this.el.querySelector('.set-builder__tune-selector');
		this.set.appendTune(select.children[select.selectedIndex].value);
	}
};

module.exports = require('exoskeleton').NativeView.extend(proto);