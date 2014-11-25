var currentPageView;

module.exports = require('exoskeleton').NativeView.extend({
    buildDom: function (html) {
        var frag = document.createDocumentFragment();
        frag.appendChild(document.createElement('div'));
        frag = frag.firstChild;
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
            destructive && (this.parent.innerHTML = '');
            this.parent.appendChild(this.el);
        }        
    },
    renderToDom: function (html, destructive) {
        this.attachDom(this.buildDom(html), destructive);
    },

    simpleDestroy: function () {
        this.stopListening();
        this.el.parentNode && this.el.parentNode.removeChild(this.el); 
    },
    setAsCurrentPage: function () {
        currentPageView && currentPageView.destroy();
        currentPageView = this;
    }
});