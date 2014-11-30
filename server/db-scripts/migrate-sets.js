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

db.oldsets.find().forEach(function (set) {
    var newSet = {
        tunes: [],
        keys: [],
        oldId: set._id
    };
    var oldTunes = []
    set.tunes.forEach(function (arr) {
        if (newSet) {
            var tune = db.oldtunes.findOne({
                _id: arr.tune
            })
            oldTunes.push({
                oldId: tune._id,
                sessionid: tune.sessionId
            });
            var newTune = db.tunes.findOne({
                oldId: tune._id
            })

            if (newTune) {
                newSet.tunes.push(newTune._id);
                newSet.keys.push(arr.root + tune.mode);
            } else {
                newSet = null;
            }
        }
    })
    if (newSet) {
        db.sets.insert(newSet); 
        if (isMandoSet(oldTunes)) {
            db.pieces.insert({
                type: 'set',
                srcId: db.sets.find().sort( { _id : -1 } ).limit(1)[0]._id
            }); 
        }
    } else {
        db.dodgySets.insert(set); 
    }
});


