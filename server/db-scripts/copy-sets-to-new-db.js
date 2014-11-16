db.sets.find().forEach(function (set) {
    var newSet = {
        tunes: [],
        keys: []
    };
    set.tunes.forEach(function (arr) {
        if (newSet) {
            var tune = db.tunes.findOne({
                _id: arr.tune
            })
            var newTune = db.getSiblingDB('jnr_local').tunes.findOne({
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
        db.getSiblingDB('jnr_local').sets.insert(newSet); 
    } else {
        db.getSiblingDB('jnr_local').dodgySets.insert(set); 
    }
});


