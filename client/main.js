'use strict';
// App boot script
// ===============
//
// Presuming that we're not using browserify to illustrate the point.

// Main app class.

// JNR.app._setInstrument(instrument);

// The user using the app.
// app.User = new require('scaffolding/user')();

// // Shared collections.
// app.sets = new require('collections/sets');
// BookStore.Articles = new Articles;

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
new (require('./scaffolding/router'))();

// Kick off the router code.
Backbone.history.start({pushState: true});