db.dropDatabase();
load('/Users/wheresrhys/Sites/jigsnreels/db-scripts/copy-data.js');
db.users.insert({name: 'wheresrhys', tunebooks: ['mandolin', 'whistle']});