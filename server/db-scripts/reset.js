load('/Users/wheresrhys/Sites/jigsnreels/server/db-scripts/drop-all.js')
db.unspoiltTunes.copyTo('tunes');
load('/Users/wheresrhys/Sites/jigsnreels/server/db-scripts/copy-data.js')
load('/Users/wheresrhys/Sites/jigsnreels/server/db-scripts/migrate-sets.js')
load('/Users/wheresrhys/Sites/jigsnreels/server/db-scripts/migrate-mando-practices.js')
