require('es6-promise').polyfill();

Object.keys(console).forEach(function (method) {
   console[method] = console[method].bind(console);
});

var db = require('./lib/dbConnection');
var express = require('express');
var path = require('path');
var http = require('http');


var app = express();

// set up templating
var swig = require('swig');

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', require('path').join(__dirname, '../templates'));
swig.setDefaults({ cache: false });

// app.use(express.logger('dev'));  /* ''default'', 'short', 'tiny', 'dev' */
// console.log(path.join(__dirname.substr(0, __dirname.lastIndexOf('/'))));
var assets = express.Router();
assets.use('/', express.static(require('path').join(__dirname, '../public')));

app.use('/assets', assets);

var api = express.Router();

api.use(require('body-parser').json());

var pieces = require('./routes/pieces');

api.get('/pieces', pieces.fetchAll);
api.get('/pieces/:id', pieces.findById);
api.post('/pieces', pieces.add);
api.put('/pieces/:id', pieces.update);
api.delete('/pieces/:id', pieces.delete);

var tunes = require('./routes/tunes');

api.get('/tunes', tunes.fetchAll);
api.get('/tunes/:id', tunes.findById);
api.post('/tunes', tunes.add);
api.put('/tunes/:id', tunes.update);
// api.del('/tunes/:id', tunes.deleteTune);

var sets = require('./routes/sets');

api.get('/sets', sets.fetchAll);
api.get('/sets/:id', sets.findById);
api.post('/sets', sets.add);
api.put('/sets/:id', sets.update);
api.delete('/sets/:id', sets.delete);

var users = require('./routes/users');

api.get('/users/:name', users.findByName);
api.put('/users/:name', users.update);

var scraper = require('./lib/scraper');

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

app.get('*', index);

if (!process.env.NO_SCRAPE) {
	scraper.init();
}

if (!module.parent) {
	var port = Number(process.env.PORT || 3000);
	app.listen(process.env.PORT, function() {
		console.log('Listening on ' + process.env.PORT);
	});
} else {
	module.exports = app;
}


