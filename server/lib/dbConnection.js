var mongoose = require('mongoose');

module.exports = (function () {

	mongoose.connect('mongodb://' + process.env.DB_HOST + '/' + process.env.DB);

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback () {
		console.log('DB connection open');
	});
})();
