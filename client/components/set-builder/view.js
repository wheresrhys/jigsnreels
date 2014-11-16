var swig = require('swig/index');
var proto = {
	tpl: require('./tpl.html'),
	events: {
        'change .set-builder__tune-selector': 'appendTune',
        'change .set-builder__tune__key-selector': 'changeKey',
        'submit .set-builder__form': 'save'
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
				tunes: this.allTunes.Presenter({
					by: 'rhythm'
				}).toJSON()
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

	appendTune: function (ev) {
		var select = ev.delegateTarget;
		this.set.appendTune(select.children[select.selectedIndex].value);
	},

	changeKey: function (ev) {
		var select = ev.delegateTarget;
		this.set.changeTuneKey(select.children[select.selectedIndex].value, select.parentNode.dataset.tuneId);
	},

	save: function (ev) {
		ev.preventDefault();
		this.set.save();
	}
};

module.exports = require('exoskeleton').NativeView.extend(proto);