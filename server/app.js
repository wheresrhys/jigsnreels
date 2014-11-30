var express = require('express');
var db = require('./models/_dbConnection');
var path = require('path');
var http = require('http');
var pieces = require('./routes/pieces');
var tunes = require('./routes/tunes');
var sets = require('./routes/sets');
var scraper = require('./lib/scraper');

var app = express();

// set up templating
var swig = require('swig');

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/../client');
swig.setDefaults({ cache: false });


app.set('port', process.env.PORT);
// app.use(express.logger('dev'));  /* ''default'', 'short', 'tiny', 'dev' */
app.use(express.static(path.join(__dirname.substr(0, __dirname.lastIndexOf('/')), 'public')));

var api = express.Router();

api.use(require('body-parser').json());

api.get('/pieces', pieces.fetchAll);
api.get('/pieces/:id', pieces.findById);
api.post('/pieces', pieces.add);
api.put('/pieces/:id', pieces.update);
api.delete('/pieces/:id', pieces.delete);

api.get('/tunes', tunes.fetchAll);
api.get('/tunes/:id', tunes.findById);
api.post('/tunes', tunes.add);
api.put('/tunes/:id', tunes.update);
// api.del('/tunes/:id', tunes.deleteTune);

api.get('/sets', sets.fetchAll);
api.get('/sets/:id', sets.findById);
api.post('/sets', sets.add);
api.put('/sets/:id', sets.update);
api.delete('/sets/:id', sets.delete);


api.get('/scraper', function (req, res) {
    scraper.init().then(function (job) {
        res.send(job)
    });
});

app.use('/api', api);

function index (req, res, next) {
    res.render('index', {
        env: process.env.ENV
    });
}

app.get('/', index)
    .get('/index.html', index)
    .get('/tune*', index)
    .get('/set*', index)
    .get('/practice*', index);

app.listen(process.env.PORT, function() {
    console.log('Listening on ' + process.env.PORT);
});
if (!process.env.NO_SCRAPE) {
    scraper.init();
}