require('es6-promise').polyfill();
Object.keys(console).forEach(function (method) {
   console[method] = console[method].bind(console);
});
var db = require('promised-mongo')(process.argv[2]);

module.exports = db.collection('oldtunes').find({}).toArray()

	.then(function (tunes) {
		return Promise.all(tunes.map(function (oldTune, index) {

			if (oldTune.sessionId) {
				return db.collection('tunes').findOne({
					sessionId: oldTune.sessionId
				}).then(function (newTune) {
					if (!newTune) {
						return db.collection('dodgyTunes').insert({
							oldId: oldTune._id
						});
					}
					newTune.oldId = oldTune._id;
					newTune.quality = oldTune.rating;
					return db.collection('tunes').save(newTune);
				}).catch(console.log)
			} else {

				return db.collection('tunes').insert({
					sessionId: 0,
					oldId: oldTune._id,
					name: oldTune.name,
					meters: [oldTune.meter],
					rhythms: [oldTune.rhythm],
					quality: oldTune.rating,
					arrangements: [ oldTune.arrangements[0]._id],
					abcId: oldTune.arrangements[0]._id,
					abc: oldTune.arrangements[0].abc,
					keys: [oldTune.arrangements[0].root + oldTune.mode]
				});
			}

		})).catch(console.log);
	});