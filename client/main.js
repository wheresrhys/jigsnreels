'use strict';

function isInternalLink(el) {

    while (el.parentNode !== document) {
        if (el.matches('a[href^="/"]')) {
            return true;
        }
        el = el.parentNode;
    }
}

// We'll use this <body> reference to put some views in it below.
var body = document.body;

var Backbone = require('exoskeleton');
require('Backbone.NativeAjax');
require('Backbone.NativeView');
// // Views that will exist regardless of what URL you are.
// var header = new require('components/header')();
// body.appendChild(header.render().el);
// // where the body of the app will go
// body.appendChild(document.createElement('main'));
// var footer = new require('components/footer')();
// body.appendChild(footer.render().el);

// var menu = new MainMenu;
// $body.append(menu.render().el);

// A module for capturing global ajax errors.
// GlobalErrors.initialize();

// // A module for tracking and broadcasting page scrolling events.
// Scrolling.initialize();
// 

// The router. We usually don't need to keep a reference to it.
var router = new (require('./scaffolding/router'))();

router.on('route', function () {
    console.log('route', arguments);
})

// Globally capture clicks. If they are internal and not in the pass
// through list, route them through Backbone's navigate method.
document.body.addEventListener('click', function (ev) {
    if (isInternalLink(ev.target)) {
        if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey) {
            return;
        }
        ev.preventDefault();
        router.navigate(ev.target.getAttribute('href'), { trigger: true })
        return false;
    }
});

// Kick off the router code.
Backbone.history.start({pushState: true});