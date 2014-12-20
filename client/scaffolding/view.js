var currentPageView;

var classEventRX = /^[a-z]+ +\./;

module.exports = require('backbone-es6').NativeView.extend({
	buildDom: function (html) {
		var frag = document.createElement('div');
		frag.innerHTML = html;
		return frag;
	},
	attachDom: function (frag, destructive) {
		if (this.el.tagName === frag.firstChild.tagName && this.el.className === frag.firstChild.className) {
			this.el.innerHTML = '';
			while (frag.firstChild.firstChild) {
				this.el.appendChild(frag.firstChild.firstChild);
			}
		} else {
			this.setElement(frag.firstChild);
			destructive && (this.parentEl.innerHTML = '');
			this.parentEl.appendChild(this.el);
		}
	},
	renderToDom: function (html, destructive) {
		this.attachDom(this.buildDom(html), destructive);
	},

	simpleDestroy: function () {
		this.stopListening();
		this.trigger('destroy');
		this.el.parentNode && this.el.parentNode.removeChild(this.el);
	},
	setAsCurrentPage: function () {
		currentPageView && currentPageView.destroy();
		currentPageView = this;
	},
	childOpts: function (bemClass, opts) {
		opts.parent = this;
		opts.parentEl = typeof bemClass === 'object' ? bemClass : this.el.querySelector('.' + this.name + '__' + bemClass);
		return opts;
	},
	// bemify: function (evs) {
	// 	var obj = {};
	// 	var name = this.name;
	// 	Object.keys(evs).forEach(function (ev) {
	// 		obj[ev.replace(classEventRX, function(match) {
	// 			return match + name + '__';
	// 		})] = evs[ev]
	// 	})
	// 	return obj;
	// }
	swig: require('swig/index')
});