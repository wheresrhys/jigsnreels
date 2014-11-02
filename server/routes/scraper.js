var http = require('http'),
    request = require('request'),
    mongoose = require('mongoose'),
    Arrangement = require('../models/arrangement'),
    Tune = require('../models/tune'),
    tuneSchema = require('../models/schemas/tune');

var TuneGetter = function(res) {
    this.response = res;
    this.newTunes = [];
    this.pendingProcesses = 0;
};

TuneGetter.prototype = {

    getNewTunes: function() {
        var pageCount,
            self = this;

        this.fetchPage('http://thesession.org/members/61738/tunebook', function(page) {
            self.processTuneList(page);
            if (page.indexOf('Page 1 of ') > -1) {
                pageCount = /Page 1 of (\d+)/.exec(page)[1];
                var iterator = self.processTuneList.bind(self);

                while (pageCount > 1) {
                    self.fetchPage('http://thesession.org/members/61738/tunebook?page=' + pageCount, iterator);
                    pageCount--;
                }
            }
        });
    },
    fetchPage: function(url, callback) {
        var self = this;
        this.pendingProcesses++;
        request.get({
            uri: url,
            port: 80,
            encoding: 'utf8'
        }, function(err, res, body) {
            if (!err) {
                self.pendingProcesses--;
                callback(body, res);
            }
        });
    },

    processTuneList: function(page) {
        var self = this;
        page.replace(/\/tunes\/(\d+)\" class=\"manifest-item-title\">(.+)<\/a>/g, function($0, $1, $2) {
            self.storeTune({
                sessionId: +$1,
                name: $2.replace(/&#8217;/g, '\'')
            });
        });
    },


    storeTune: function(tune) {
        var model,
            self = this;

        this.pendingProcesses++;

        Tune.createNewFromSession(tune, function(newTune) {
            self.pendingProcesses--;
            if (newTune) {
                self.retrieveTuneInfo(newTune);
            } else if (!self.pendingProcesses) {
                if (!self.newTunes.length) {
                    console.log('sent no new tunes');
                }
                self.send();
            }
        });

    },
    retrieveTuneInfo: function(tune) {
        var self = this;
        this.pendingProcesses++;
        this.fetchPage('http://www.thesession.org/tunes/' + tune.sessionId + '/abc', function(abc) {
            self.pendingProcesses--;
            abc = abc.split(/X: \d+\r\n/);
            abc.shift(); // get rid of the intial empty string
            if (!abc.length) {
                return;
            }
            tune.meter = (abc[0].match(/M:(?:\s*)(.*)/) || [''])[1];
            tune.rhythm = (abc[0].match(/R:(?:\s*)(.*)/) || [''])[1];
            tune.mode = (abc[0].match(/K:(?:\s*)[A-Z]([A-Za-z]*)/) || [''])[1];

            tune.arrangements = abc.map(function(abc) {

                return {
                    root: (abc.match(/K:(?:\s*)([A-Z](?:b|#)?)/) || [''])[1],
                    abc: abc.split(/K\:\s?[a-z]{4}\r\n/i)[1],
                    tune: tune._id
                };
            });


            self.saveTuneInfo(tune);


        });

    },

    saveTuneInfo: function(tune) {
        var self = this;
        self.pendingProcesses++;
        tune.save(function(err) {
            self.pendingProcesses--;
            self.newTunes.push(tune);
            if (!self.pendingProcesses) {
                console.log('sent new tunes');
                self.send();
            }
        });
    },

    send: function() {
        if (this.response) {
            this.response.send(this.newTunes);
        } else if (this.callback) {
            this.callback();
        }
    }
};



exports.getNew = function(req, res) {
    var getter = new TuneGetter(res);

    getter.getNewTunes();
};

exports.setCallback = function(callback) {
    this.callback = callback;
};

exports._TuneGetter = TuneGetter;
//TuneGetter.prototype.retrieveTuneInfo({sessionId: 4239});
//exports.getNew();