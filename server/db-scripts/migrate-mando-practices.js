load('/Users/wheresrhys/Sites/jigsnreels/server/db-scripts/reset-tunes.js')
var practices = [];

db.oldperformances.find({
    instrument: 'mandolin'
}).forEach(function (perf) {
    var tune = db.oldtunes.findOne({
        "arrangements._id": perf.arrangement
    });

    if (!tune) {
        return db.dodgyPractices.insert(perf);
    }
    var arr = tune.arrangements.filter(function (a) {
        return a._id.equals(perf.arrangement);
    })[0];

    if (perf.best > 2 || 
        ( (perf.best > 0 || tune.popularity === 3) && tune.rating > 3 ) || 
        tune.rating === 5 ) {
        var newTune = db.tunes.findOne({sessionId: tune.sessionId});
        if (!newTune) {
            return db.dodgyPerfs.insert(perf); 
        }
        practices.push({
            type: 'tune',
            srcId: newTune._id,
            stickiness: 0
        })
    }
});

practices.forEach(function (practice) {
    var unique = true;

    db.sets.find().forEach(function (set) {
        if (db.practices.find({
            srcId: set._id,
            type: 'set'
        }).length()) {
            set.tunes.forEach(function (tuneId) {
                if (tuneId.equals(practice.srcId)) {
                    unique = false; 
                }
            });
        }
    })
    if (unique) {
        db.practices.insert(practice);
    }
})