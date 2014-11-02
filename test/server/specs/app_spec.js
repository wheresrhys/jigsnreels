require('../helpers/config.js');
require('../../jasmine.jnr.js');
var app = require('../../../server/app.js'),
    request = require('request');

describe('app', function () {
    describe('index page', function () {
        it('should respond with a html page from /', function (done) {
            request('http://localhost:3090/', function (error, response, body) {
                expect(body.indexOf('<!DOCTYPE html>')).toBe(0);
                done();
            });
        });
        it('should respond with a html page from /index.html', function (done) {
            request('http://localhost:3090/index.html', function (error, response, body) {
                expect(body.indexOf('<!DOCTYPE html>')).toBe(0);
                done();
            });
        });
        it('should add an environment class to the html', function (done) {
            request('http://localhost:3090/', function (error, response, body) {
                expect(body.indexOf('<html class="no-js test"> ')).toBeGreaterThan(-1);
                done();
            });
        });
    });

    describe('restful end points', function () {
        var endPoints = ['performances', 'tunes'],

            endPointSuite = function (endPoint) {
                return function () {
                    var router;
                    beforeEach(function () {
                        router = require('../../../server/routes/' + endPoint);
                    });
                    it('should allow fetching all records', function () {
                        spyOn(router, 'fetchAll').andCallFake(function (req, res) {
                            res.send('fetchedAll');
                        });
                        request('http://localhost:3090/rest/' + endPoint, function (error, response, body) {
                            expect(error).toBeFalsy();
                            expect(router.fetchAll).toHaveBeenCalled();
                            expect(body).toBe('fetchedAll');
                            done();
                        });
                    });

                    it('should allow fetching a single record', function () {
                        spyOn(router, 'findById').andCallFake(function (req, res) {
                            res.send('passed' + req.params.id);
                        });
                        request('http://localhost:3090/rest/' + endPoint + '/111111111111', function (error, response, body) {
                            expect(error).toBeFalsy();
                            expect(router.findById).toHaveBeenCalled();
                            expect(body).toBe('passed111111111111');
                            done();
                        });
                    });
                    it('should allow creating a record', function () {
                        spyOn(router, 'add').andCallFake(function (req, res) {
                            var returns = req.body;
                            returns.extra = 'created';
                            res.send(req.body);
                        });
                        request.post({
                            uri: 'http://localhost:3090/rest/' + endPoint,
                            headers: {'content-type': 'application/json;charset=UTF-8'},
                            body: '{"name":"testName"}'
                        }, function (error, response, body) {
                            expect(error).toBeFalsy();
                            expect(router.add).toHaveBeenCalled();
                            expect(JSON.parse(body)).toEqual({
                                name: 'testName',
                                extra: 'created'
                            });
                            done();
                        });
                    });
                    it('should allow editing a record', function () {
                        spyOn(router, 'update').andCallFake(function (req, res) {
                            var returns = req.body;
                            returns.extra = 'updated';
                            res.send(req.body);
                        });
                        request.put({
                            uri: 'http://localhost:3090/rest/' + endPoint + '/111111111111',
                            headers: {'content-type': 'application/json;charset=UTF-8'},
                            body: '{"name":"testName"}'
                        }, function (error, response, body) {
                            expect(error).toBeFalsy();
                            expect(router.update).toHaveBeenCalled();
                            expect(JSON.parse(body)).toEqual({
                                name: 'testName',
                                extra: 'updated'
                            });
                            done();
                        });
                    });
                };
            };

        for (var i = 0, il = endPoints.length; i<il; i++) {
            describe(endPoints[i], endPointSuite(endPoints[i]));
        }

        describe('scraper', function () {
            it('should allow fetching all new tunes', function () {
                var router = require('../../../server/routes/scraper');
                spyOn(router, 'getNew').andCallFake(function (req, res) {
                    res.send('scraped');
                });
                request('http://localhost:3090/rest/scraper', function (error, response, body) {
                    expect(error).toBeFalsy();
                    expect(router.getNew).toHaveBeenCalled();
                    expect(body).toBe('scraped');
                    done();
                });
            });
        });

    });

    describe('deep linking (disabled for time being)', function () {
        it('should not allow deep linking', function () {
            request('http://localhost:3090/tunes/mandolin', function (error, response, body) {
                console.log('err', error);
                console.log('res', response);
                console.log('bod', body);
                done();
            });
        });
    });

});
