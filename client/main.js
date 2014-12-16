'use strict';

require('./scaffolding/tpl');

// We'll use this <body> reference to put some views in it below.
var body = document.body;
// // Views that will exist regardless of what URL you are.
var header = new (require('./components/header'))({
	parentEl: document.body
});

// // where the body of the app will go
body.appendChild(document.createElement('main'));

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
