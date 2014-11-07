module.exports = require('exoskeleton').Router.extend({
	routes: {
		'': function () {
			this.navigate('sets/', {trigger: true});
		},
		// 'tunes/' : 'tunes',
		'sets/': require('../controllers/set-list')//,
		// 'set-builder/': 'setBuilder',
		// 'tunes/:instrument' : 'tunes',
		// 'sets/:instrument' : 'sets',
		// 'set-builder/:instrument': 'setBuilder'
	}
	// init: ,
	// tunes : function(instrument) {
	// 	JNR.app._setInstrument(instrument);
	// 	JNR.app.loadView('tunes');
	// },
	// sets : function(instrument) {
	// 	JNR.app._setInstrument(instrument);
	// 	JNR.app.loadView("sets");
	// },
	// setBuilder: function(instrument) {
	// 	JNR.app._setInstrument(instrument);
	// 	JNR.app.loadView("set-builder");
	// }
});