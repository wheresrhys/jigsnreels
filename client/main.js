'use strict';

require('es6-promise').polyfill();

// We'll use this <body> reference to put some views in it below.
var body = document.body;

var Backbone = require('exoskeleton');
require('Backbone.NativeAjax');
require('Backbone.NativeView');

Backbone.Deferred = function () {
	var obj = {};
	var p = new Promise(function (resolve, reject) {
		obj.resolve = resolve;
		obj.reject = reject;
	});
	obj.promise = p;
	return obj;
};  
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
var router = require('./scaffolding/router');
