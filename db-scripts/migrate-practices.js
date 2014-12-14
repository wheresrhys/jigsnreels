require('es6-promise').polyfill();

Object.keys(console).forEach(function (method) {
   console[method] = console[method].bind(console);
});

var db = require('promised-mongo')(process.argv[2]);
var sets;
var pieces;

var convertPerformance = function (perf) {

	return db.collection('oldtunes').findOne({
		'arrangements._id': perf.arrangement
	})
		.then(function (oldTune) {
			var arr = oldTune.arrangements.filter(function (a) {
				return a._id.equals(perf.arrangement);
			})[0];

			if (perf.best > 2 ||
				( (perf.best > 0 || oldTune.popularity === 3) && oldTune.rating > 3 ) ||
				oldTune.rating === 5 ) {
				return db.collection('tunes').findOne({oldId: oldTune._id})
					.then(function (newTune) {
						var set = sets.filter(function (set) {
							var index;
							set.tunes.some(function (tune, i) {
								if (tune.equals(newTune._id)) {
									index = i;
									return true;
								}
							});
							return index > -1 && set.keys[index] === arr.root + oldTune.mode
						})[0];
						if (set) {
							var piece = pieces.filter(function (piece) {
								return piece.srcId.equals(set._id);
							})[0]

							if (piece && piece.tunebook.indexOf(perf.instrument) > -1) {
								console.log('don\'t create', oldTune.name, perf.instrument);
								return;
							}
						}
						console.log('create', oldTune.name, perf.instrument);
						return db.collection('pieces').insert({
							type: 'tune',
							srcId: newTune._id,
							tunebook: 'wheresrhys:' + perf.instrument
						})
					});
			}
		}).catch(function (err) {
			return db.collection('dodgyPractices').insert({
				perfId: perf._id
			});
		});
}

Promise.all([
	db.collection('sets').find({}).toArray(),
	db.collection('pieces').find({}).toArray(),
])
	.then(function (vals) {
		sets = vals[0];
		pieces = vals[1];
		return db.collection('oldperformances').find({}).toArray()
			.then(function (perfs) {
				return Promise.all(perfs.map(convertPerformance));
			})
			.catch(console.log);
	});
