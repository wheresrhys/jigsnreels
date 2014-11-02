(function () {
    Helpers = window.Helpers || {};

    var getTune = function (id) {
        return {
            _id: 'tuneId-' + id,
            alternativeNames: ['name1-' + id, 'name2-' + id],
            arrangements: [
                {
                    root: 'D',
                    mode: 'maj',
                    abc: 'abc1-' + id,
                    _id: 'arrId1-' + id,
                    author: 'arrAuthor1-' + id 
                },
                {
                    root: 'B',
                    mode: 'min',
                    abc: 'abc2-' + id,
                    _id: 'arrId2-' + id,
                    author: 'arrAuthor2-' + id 
                }
            ],
            meter: id + '/4',
            name: 'tuneName' + id,
            performances: getPerformances(id),
            popularity: (id % 5) -1,
            rating: (id % 6) -1,
            rhythm: 'rhythm' + id,
            sessionId: id + 100
        };
    },
    getPerformances = function (id) {
        var performances = [];
        for (var i = 1, il = 3; i<=il;i++) {
            if (id % 3 > 0) {
                performances.push({
                    arrangement: 'arrId' + i + '-' + id,
                    standard: id,
                    notes: '',
                    best: ((id + 2) * i) % 6,
                    difficulty: ((id + 1) * i) % 6,
                    lastPracticed: (1970 + (id * 10) + i) + '-01-01T00:00:15.956Z',
                    special: (id * i) % 2 === 0,
                    instrument: 'instrument' + i,
                    _id: 'performanceId' + i + '-' + id,
                });
            }
        }
        return performances;
    };
    
    var http,
        Server = {
        addHttp: function (backend) {
            http = backend;
        },
        mockQuery: function (n) {
            var response = [];
            for(var i =1; i <= n; i++) {
                response.push(getTune(i));
            }
            http.whenGET('/rest/tunes').respond(response);
        },
        mockScraper: function () {
            http.whenGET('/rest/scraper').respond([]);
        },
        mockViews: function () {
            http.whenGET(/views\/.*/).respond({});
        },
        clearMocks: function () {
            this.xhr.restore();
        }
    };

    Helpers.Server = Server;
    
})();