function isInternalLink(el) {
	while (el.parentNode && el.parentNode !== document) {
		if (el.matches('a[href^="/"]')) {
			return true;
		}
		el = el.parentNode;
	}
}

var Router = require('exoskeleton').Router.extend({
	routes: {
		'': function () {
			this.navigate('practice', {trigger: true});
		},
		// 'tunes/' : 'tunes',
		'practice': 'practice',
		'sets': 'sets',
		'set-editor(/:id)': 'set-editor'
	},
	'practice': require('../controllers/practice-list'),
	'sets': require('../controllers/set-list'),
	'set-editor': require('../controllers/set-editor')
});

var router = new Router();

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
require('exoskeleton').history.start({pushState: true});

module.exports = router;