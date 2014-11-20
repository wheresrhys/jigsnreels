module.exports = require('exoskeleton').Router.extend({
	routes: {
		'': function () {
			this.navigate('sets', {trigger: true});
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

