function getInternalLink(el) {
	while (el.parentNode && el.parentNode !== document) {
		if (el.matches('a[href^="/"]')) {
			return el;
		}
		el = el.parentNode;
	}
}

var Router = require('backbone-es6').Router.extend({
	routes: {
		'': function () {
			this.navigate('practice', {trigger: true});
		},
		'practice(/:tunebook)': 'practice',
		'tunes': 'tunes',
		// 'tunes/edit(/:id)': 'tune-editor',
		// 'tunes/view/:id': 'tune-viewer',
		'sets': 'sets',
		// 'sets/view/:id': 'set-viewer',
		'sets/edit(/:id)': 'set-editor',
	},
	'practice': require('../controllers/practice-list'),

	'tunes': require('../controllers/tune-list'),
	// 'tune-editor': require('../controllers/tune-editor'),
	// 'tune-viewer': require('../controllers/tune-viewer'),

	'sets': require('../controllers/set-list'),
	// 'set-viewer': require('../controllers/set-viewer'),
	'set-editor': require('../controllers/set-editor')
});

var router = new Router();

// Globally capture clicks. If they are internal and not in the pass
// through list, route them through Backbone's navigate method.
document.body.addEventListener('click', function (ev) {
	var el = getInternalLink(ev.target)
	if (el) {
		if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey) {
			return;
		}
		ev.preventDefault();
		router.navigate(el.getAttribute('href'), { trigger: true })
		return false;
	}
});

// Kick off the router code.
require('backbone-es6').history.start({pushState: true});

module.exports = router;