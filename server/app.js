var express = require('express'),
    db = require('./models/_dbConnection'),
    path = require('path'),
    http = require('http'),
    performances = require('./routes/performances'),
    tunes = require('./routes/tunes'),
    sets = require('./routes/sets'),
    scraper = require('./routes/scraper');
    


var app = express();

app.configure(function () {
    app.set('port', process.env.PORT);
    app.use(express.logger('dev'));  /* ''default'', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.static(path.join(__dirname.substr(0, __dirname.lastIndexOf('/')), 'public')));

});

app.get('/rest/performances', performances.fetchAll);
app.get('/rest/performances/:id', performances.findById);
app.post('/rest/performances', performances.add);
app.put('/rest/performances/:id', performances.update);
// app.del('/rest/performances/:id', performances.deletePerformance);

app.get('/rest/tunes', tunes.fetchAll);
app.get('/rest/tunes/:id', tunes.findById);
app.post('/rest/tunes', tunes.add);
app.put('/rest/tunes/:id', tunes.update);
// app.del('/rest/tunes/:id', tunes.deleteTune);

app.get('/rest/sets', sets.fetchAll);
app.get('/rest/sets/:id', sets.findById);
app.post('/rest/sets', sets.add);
app.put('/rest/sets/:id', sets.update);

app.get('/rest/scraper', scraper.getNew);

function parseIndex (req, res, next) {
    var fs = require('fs');
    fs.readFile(path.join(__dirname.substr(0, __dirname.lastIndexOf('/')), 'public/index.html'), 'utf8', function (err, data) {
        if (err) {
            throw err;
        }
        res.send(data.replace(/\{\{env\}\}/g, process.env.ENV));
    });
}

app.get('/', parseIndex).get('/index.html', parseIndex);


function preventDeepLink (req, res, next){
    res.writeHead(301, {
        Location: '/'
    });
    res.end();
}

app.get('/tunes*', preventDeepLink)
    .get('/sets*', preventDeepLink);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});