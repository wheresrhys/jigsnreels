var mongoose = require('mongoose'),
	arrangementSchema = mongoose.Schema({
		abc: String
	}),
	tuneSchema = mongoose.Schema({
		name: String,
		arrangements: [arrangementSchema]
	});

mongoose.connect('mongodb://localhost/jnr_dev');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {

});

var Arrangement = mongoose.model('Arr', arrangementSchema),
	Tune = mongoose.model('Tu', tuneSchema);


var tune = Tune.create({
	name: 'test'
}, function (err, newTune) {
	newTune.arrangements = [{abc:'abc1'}];
	newTune.save(function () {
		Arrangement.create({
			abc: 'abc2'
		}, function (err, arr) {
			newTune.arrangements.push(arr);
			newTune.save();
		});
	});
});

var tune = Tune.create({
	name: 'test',
	arrangements: [{abc:'abc3'}]
}, function (err, newTune) {
	Arrangement.create({
		abc: 'abc4'
	}, function (err, arr) {
		newTune.arrangements.push(arr);
		newTune.save();
	});
});
