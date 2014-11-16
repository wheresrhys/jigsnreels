module.exports = require('exoskeleton').Router.extend({
	routes: {
		'': function () {
			this.navigate('sets', {trigger: true});
		},
		// 'tunes/' : 'tunes',
		'practice': require('../controllers/practice-list'),
		'sets': require('../controllers/set-list'),
		'set-builder': require('../controllers/set-builder')
	}
});