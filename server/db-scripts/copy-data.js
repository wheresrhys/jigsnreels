db.getSiblingDB('jnr_prod').sets.find().forEach(function (set) {
    db.oldsets.insert(set); 
});

db.getSiblingDB('jnr_prod').tunes.find().forEach(function (tune) {
    db.oldtunes.insert(tune); 
});

db.getSiblingDB('jnr_prod').performances.find().forEach(function (performance) {
    db.oldperformances.insert(performance); 
});
