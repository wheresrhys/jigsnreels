module.exports = require('exoskeleton').NativeView.extend({
    buildDom: function (html) {
        var frag = document.createDocumentFragment();
        frag.appendChild(document.createElement('div'));
        frag = frag.firstChild;
        frag.innerHTML = html;
        return frag;
    },
    attachDom: function (frag) {
        if (this.el.tagName === frag.firstChild.tagName && this.el.className === frag.firstChild.className) {
            this.el.innerHTML = '';
            while (frag.firstChild.firstChild) {
                this.el.appendChild(frag.firstChild.firstChild);
            }
        } else {
            this.setElement(frag.firstChild);
            this.parent.appendChild(this.el);
        }        
    },
    renderToDom: function (html) {
        this.attachDom(this.buildDom(html));
    },
});