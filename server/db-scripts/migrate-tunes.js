/* globals db */
db.oldtunes.find().forEach(function (oldTune) { 
  var newTune;
  if (oldTune.sessionId) {
    newTune = db.tunes.findOne({
      sessionId: oldTune.sessionId 
    })
    if (newTune) {
      newTune.oldId = oldTune._id;
      newTune.quality = oldTune.rating;
    } else {
      return db.dodgyTunes.insert(oldTune);
    }
    db.tunes.save(newTune);
  } else {
    print(oldTune.name)
    newTune = {
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
    }
    db.tunes.insert(newTune);
  }

});


