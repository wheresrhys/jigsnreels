require('es6-promise').polyfill();

var request = require('request-then');
var mongoose = require('mongoose-q');
var Arrangement = require('../models/arrangement');
var Tune = require('../models/tune');
var tuneSchema = require('../models/schemas/tune');
var debug = require('debug')('scraper')


var groupByPopularity = function (arr) {
    var o = {};

    arr.forEach(function (item) {
        o[item] ? (o[item] = 1) : o[item]++;
    });

    return Object.keys(o).map(function (key) {
        return {
            key: key,
            count: o[key]
        }
    }).sort(function (a, b) {
        return a.count > b.count;
    }).map(function (obj) {
        return obj.key;
    })
}

var TuneGetter = function() {
    this.newTunes = [];
    this.processTuneList = this.processTuneList.bind(this);
    this.storeTune = this.storeTune.bind(this); 
};



TuneGetter.prototype = {

    getNewTunes: function () {
        var pageCount;
        var self = this;

        debug('fetching first page');
        var job = request('http://thesession.org/members/61738/tunebook').then(function(res) {
            var page = res.body;
            var promises = [];

            promises.push(self.processTuneList(res));

            if (page.indexOf('Page 1 of ') > -1) {
                pageCount = /Page 1 of (\d+)/.exec(page)[1];

                while (pageCount > 1) {
                    debug('fetching ' +  pageCount + ' page');
                    promises.push(request('http://thesession.org/members/61738/tunebook?page=' + pageCount).then(self.processTuneList));
                    pageCount--;
                }
            }
            
            return Promise.all(promises).then(function (pages) {
                return [].concat.apply([], pages);
            });
        })


        job.catch(function (err) {
            debug(err);
            setTimeout(function () {throw err})
        });

        return job;

    },

    processTuneList: function (res) {
        var tunes = [];
        res.body.replace(/\/tunes\/(\d+)\" class=\"manifest__item__title\">([^<]+)<\/a>/g, function($0, $1, $2) {
            debug('retrieved tune listing %s, %s from thesession', $1, $2);
            tunes.push({
                sessionId: +$1,
                name: $2.replace(/&#8217;/g, '\'')
            });
        });

        return Promise.all(tunes.map(this.storeTune));
    },

    storeTune: function (tune) {
        var self = this;

        return Tune.createNewFromSession(tune).then(function(newTune) {
            if (newTune.arrangements.length) {
                debug('full details already exist for tune %s, %s', newTune.sessionId, newTune.name);
                return newTune;  
            } else {
                return self.retrieveTuneInfo(newTune);
            }
        });

    },

    retrieveTuneInfo: function (tune) {
        debug('retrieving full details for tune %s, %s', tune.sessionId, tune.name);
        var self = this;
        return request('http://www.thesession.org/tunes/' + tune.sessionId + '/abc').then(function(res) {
            var arrs = res.body;
            arrs = arrs.split(/X: \d+\r\n/);
            arrs.shift(); // get rid of the intial empty string
            if (!arrs.length) {
                debug('No abc available for tune %s, %s', tune.sessionId, tune.name);
                return tune;
            }

            

            arrs = arrs.map(function (arr) {
                return {
                    meter: (arr.match(/M:(?:\s*)(.*)/) || [])[1],
                    rhythm: (arr.match(/R:(?:\s*)(.*)/) || [])[1],
                    mode: (arr.match(/K:(?:\s*)[A-Z]([A-Za-z]*)/) || [])[1],
                    root: (arr.match(/K:(?:\s*)([A-Z](?:b|#)?)/) || [])[1],
                    abc: arr.split(/K\:\s?[a-z]{4}\r\n/i)[1],
                    tune: tune._id
                }
            });

            tune.meters = groupByPopularity(arrs.map(function (t) {
                return t.meter;
            }));
            tune.keys = groupByPopularity(arrs.map(function (t) {
                return t.root + t.mode;
            }));
            tune.rhythms = groupByPopularity(arrs.map(function (t) {
                return t.rhythm;
            }));

            tune.abc = arrs.filter(function (arr) {
                return (arr.meter === tune.meters[0] &&
                    arr.rhythm === tune.rhythms[0] &&
                    (arr.root + arr.mode) === tune.keys[0]);
            })[0] || arrs[0];

            return Promise.all(arrs.map(function (arr) {
                return Arrangement.createQ(arr);
            })).then(function (arrs) {
                var defaultArr = arrs.filter(function (arr) {
                    return (arr.meter === tune.meters[0] &&
                        arr.rhythm === tune.rhythms[0] &&
                        (arr.root + arr.mode) === tune.keys[0]);
                })[0] || arrs[0];

                tune.abcId = defaultArr._id;
                tune.abc = require('util').format(
                    'M: %s\nK: %s\nR: %s\n%s',
                    defaultArr.meter,
                    defaultArr.root + defaultArr.mode,
                    defaultArr.rhythm,
                    defaultArr.abc
                );

                tune.arrangements = arrs.map(function (arr) {
                    return arr._id;
                })
                
                return tune.saveQ().then(function (tune) {
                    debug('Details fetched and saved for tune %s, %s', tune.sessionId, tune.name);
                    return tune;
                });

            });

        });

    }
};

var getter;

exports.init = function() {
    if (getter) {
        return getter.getNewTunes();
    }
    getter = new TuneGetter();

    

    setInterval(function () {
        getter.getNewTunes();
    }, 1000 * 60 * 60)

    return getter.getNewTunes();
};

// exports.setCallback = function(callback) {
//     this.callback = callback;
// };

// exports._TuneGetter = TuneGetter;
//TuneGetter.prototype.retrieveTuneInfo({sessionId: 4239});
//exports.getNew();