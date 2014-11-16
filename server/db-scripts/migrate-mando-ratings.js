// var practices = [];

// db.performances.find().forEach(function (perf) {
//     var arr = db.arrangements.findOne({
//         _id: perf.arrangement
//     })
//     var tune = db.oldtunes.findOne({
//         _id: arr.tuneId
//     })

//     // worth practicing individually
//     if (perf.best > 2 || 
//         ( (perf.best > 0 || tune.popularity === 3) && tune.rating > 3 ) || 
//         tune.rating === 5 ) {
//         var newTune = db.tunes.findOne({sesssionId: tune.sessionId});
//         if (!newTune) {
//             return db.dodgyPerfs.insert(perf); 
//         }
//         var practice = {
//             type: 'tune',
//             srcId: newTune._id,
//             stickyness: 0
//         }
//     }
// });


// practices.forEach(function (practice) {
//     if (!db.sets.find().some(function (set) {
//         return set.tunes.contains(practice.srcId);
//     })) {
//         db.practices.insert(practice);
//     }
// })