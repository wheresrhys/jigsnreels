var whistleTunes = [10353, 629, 726, 3297, 52, 151];

function isMandoSet (tunes) {
    var is = true;
    tunes.forEach(function (tune) {
        if (whistleTunes.indexOf(tune) > -1) {
            is = false;
        }
    })
    if (tunes[0] == 3462 && tunes[1] == 29) {
        is = false
    }
    return is;
}

db.oldsets.find().forEach(function (set) {
    var newSet = {
        tunes: [],
        keys: []
    };
    var sessionTunes = []
    set.tunes.forEach(function (arr) {
        if (newSet) {
            var tune = db.oldtunes.findOne({
                _id: arr.tune
            })
            sessionTunes.push(tune.sessionId);

            var newTune = db.tunes.findOne({
                sessionId: tune.sessionId
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
        if (isMandoSet(sessionTunes)) {
            db.practices.insert({
                type: 'set',
                srcId: db.sets.find().sort( { _id : -1 } ).limit(1)[0]._id,
                stickyness: 0
            }); 
        }
    } else {
        db.dodgySets.insert(set); 
    }
});


