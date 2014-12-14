require('es6-promise').polyfill();
var db = require('promised-mongo')(process.argv[2]);

var whistleTunes = [10353, 629, 726, 3297, 52, 151];

function isMandoSet (tunes) {
	var is = true;
	tunes.forEach(function (tune) {
		if (whistleTunes.indexOf(tune.sessionId) > -1) {
			is = false;
		}
	})
	if (tunes[0].sessionId == 3462 && tunes[1].sessionId == 29) {
		is = false
	}
	return is;
}


db.collection('oldsets').find({}).toArray()
	.then(function (sets) {
		return Promise.all(sets.map(function (set) {
			var newSet = {
				tunes: [],
				keys: [],
				oldId: set._id
			};

			var oldTunes = []

			return Promise.all(set.tunes.map(function (arrangement) {
				return db.collection('oldtunes').findOne({
					_id: arrangement.tune
				}).then(function (oldTune) {
						oldTunes.push({
							oldId: oldTune._id,
							sessionId: oldTune.sessionId
						});
					return db.collection('tunes').findOne({
						oldId: oldTune._id
					}).then(function (newTune) {

						if (newTune) {
							newSet.tunes.push(newTune._id);
							newSet.keys.push(arrangement.root + oldTune.mode);
							return newTune
						} else {
							throw 'missing tune';
						}
					});
				});
			})).then(function () {
				return db.collection('sets').insert(newSet)
					.then(function (set) {
						return db.collection('pieces').insert({
							type: 'set',
							srcId: set._id,
							tunebook: 'wheresrhys:' + isMandoSet(oldTunes) ? 'mandolin' : 'whistle'
						})
					});
			}, function (err) {
				db.collection('dodgySets').insert(set);
			})

		}));
	});

