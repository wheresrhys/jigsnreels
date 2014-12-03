var mongoose = require('mongoose'),
	tuneSchema = require('./schemas/tune');

var Tune = mongoose.model('Tune', tuneSchema);

module.exports = Tune;


//Model._flush();

// Tune.count({}, function (err, count) {

//	 if (count === 0) {
//		 console.log('migrating tunes', count);
//		 // require('../migrate');
//	 }
// });

// Model.findOne({sessionId: 449}, function (e,c) {
//	 console.log(c)
// });

// Model.createNewFromSession({sessionId: 1});


