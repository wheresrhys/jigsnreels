// require('../../../jasmine.jnr.js');
var mongoose = require('mongoose'),
	httpMocks = require('express-mocks-http'),
	request = require('request'),
	Tune = require('../../../server/models/tune'),
	fs = require('fs');


xdescribe('routes/scraper', function () {
	var scraper,
		req,
		res,
		Getter;

	beforeEach(function () {
		scraper = require('../../../server/lib/scraper');
		Getter = scraper._TuneGetter;
		res = httpMocks.createResponse();
		spyOn(res, 'send');
	});

	describe('handling the request', function () {
		it('should start the process to get all new tunes', function () {
			req = httpMocks.createRequest({
				method: 'GET',
				url: '/rest/scraper'
			});

			spyOn(Getter.prototype, 'getNewTunes').andCallFake(function () {
				res.send('got new tunes');
			});

			scraper.getNew(req, res);
			expect(Getter.prototype.getNewTunes).toHaveBeenCalled();
			expect(res.send).toHaveBeenCalledWith('got new tunes');
		});
	});

	describe('TuneGetter object', function () {
		var getter;

		beforeEach(function () {
			getter = new Getter(res);
		});
		describe('getNewTunes', function () {

			it('should fetch the first page of the tunebook (and stop if no more pages)', function () {
				var page = fs.readFileSync('./test/server/stubs/tunebook.html', 'utf-8');
				spyOn(getter, 'fetchPage').andCallFake(function (url, callback) {
					callback(page);
				});
				spyOn(getter, 'processTuneList');
				getter.getNewTunes();
				expect(getter.fetchPage.calls.length).toBe(1);
				expect(getter.processTuneList.calls.length).toBe(1);
				expect(getter.fetchPage).lastCalledWith('http://thesession.org/members/61738/tunebook');
				expect(getter.processTuneList).toHaveBeenCalledWith(page);
			});

			it('should fetch subsequent pages of the tunebook if paginated', function () {
				var page = fs.readFileSync('./test/server/stubs/tunebook(paginated).html', 'utf-8');
				spyOn(getter, 'fetchPage').andCallFake(function (url, callback) {
					callback(page);
				});
				spyOn(getter, 'processTuneList');
				getter.getNewTunes();
				expect(getter.fetchPage.calls.length).toBe(3);
				expect(getter.fetchPage).recentlyCalledWith(2, 'http://thesession.org/members/61738/tunebook');
				expect(getter.fetchPage).recentlyCalledWith(1, 'http://thesession.org/members/61738/tunebook?page=3');
				expect(getter.fetchPage).recentlyCalledWith(0, 'http://thesession.org/members/61738/tunebook?page=2');
				expect(getter.processTuneList.calls.length).toBe(3);
			});

		});

		describe('fetchPage', function () {
			it('should make a request to the given url and run the callback on the returned page', function () {
				var pageCallback = jasmine.createSpy('fetchPageCallback');

				spyOn(request, 'get').andCallFake(function (opts, callback) {
					callback(undefined, 'response', 'body');
				});
				getter.fetchPage('url', pageCallback);
				expect(request.get).lastCalledWith({
					uri: 'url',
					port: 80,
					encoding: 'utf8'
				});
				expect(pageCallback).toHaveBeenCalledWith('body', 'response');

			});

			xit('should cope well with a failed request', function () {

			});

			it('should update the pending processes count', function () {
				var pageCallback = jasmine.createSpy('fetchPageCallback');
				spyOn(request, 'get').andCallFake(function (opts, callback) {
					expect(getter.pendingProcesses).toBe(1);
					callback(undefined, 'response', 'body');
					expect(getter.pendingProcesses).toBe(0);
				});

				getter.fetchPage('url', pageCallback);

			});
		});

		describe('processTuneList', function () {
			var page = fs.readFileSync('./test/server/stubs/tunebook.html', 'utf-8');
			it('should check all tunes listed on the page against database', function () {
				spyOn(getter, 'storeTune');
				getter.processTuneList(page);
				expect(getter.storeTune.calls.length).toBe(2);
			});
			it('should eliminate special characters from tune names', function () {
				spyOn(getter, 'storeTune');
				getter.processTuneList(page);
				expect(getter.storeTune).toHaveBeenCalledWith({
					sessionId: 2,
					name: '\'Tune-2\''
				});
			});
		});

		describe('storeTune', function () {
			it('should try and create a new tune in the database', function () {
				spyOn(Tune, 'createNewFromSession');
				getter.storeTune('test-tune');
				expect(Tune.createNewFromSession).lastCalledWith('test-tune');
			});

			it('should get tune info from the session when tune is new', function () {
				spyOn(Tune, 'createNewFromSession').andCallFake(function (tune, callback) {
					callback('New tune');
				});
				spyOn(getter, 'retrieveTuneInfo');
				getter.storeTune('test-tune');
				expect(getter.retrieveTuneInfo).lastCalledWith('New tune');
			});

			it('should not communicate with the session when tune already existed', function () {
				spyOn(Tune, 'createNewFromSession').andCallFake(function (tune, callback) {
					callback();
				});
				spyOn(getter, 'retrieveTuneInfo');
				getter.storeTune('test-tune');
				expect(getter.retrieveTuneInfo).not.toHaveBeenCalled();
			});
			it('should update the pending processes count', function () {
				var tuneCallback = jasmine.createSpy('tuneCallback');
				spyOn(Tune, 'createNewFromSession').andCallFake(function (tune, callback) {
					expect(getter.pendingProcesses).toBe(1);
					callback();
					expect(getter.pendingProcesses).toBe(0);
				});

				getter.fetchPage('url', tuneCallback);

			});

			describe('sending a http response', function () {
				beforeEach(function () {
					spyOn(Tune, 'createNewFromSession').andCallFake(function (tune, callback) {
						callback();
					});
					spyOn(getter, 'send');
					spyOn(getter, 'retrieveTuneInfo');
				});
				it('should send a response if no pending processes', function () {
					getter.pendingProcesses = 0;
					getter.storeTune();
					expect(getter.send).toHaveBeenCalled();
				});

				it('should not send a response if there are still processes pending', function () {
					getter.pendingProcesses = 1;
					getter.storeTune();
					expect(getter.send).not.toHaveBeenCalled();
				});
			});



		});

		describe('retrieveTuneInfo', function () {

			it('should fetch the tune\'s abc sheet', function () {
				spyOn(getter, 'fetchPage');
				getter.retrieveTuneInfo({
					sessionId: 1
				});
				expect(getter.fetchPage.calls.length).toBe(1);
				expect(getter.fetchPage).lastCalledWith('http://www.thesession.org/tunes/1/abc');
			});

			it('should update the pending processes count', function () {
				var tuneCallback = jasmine.createSpy('tuneCallback');
				spyOn(getter, 'fetchPage').andCallFake(function (url, callback) {
					expect(getter.pendingProcesses).toBe(1);
					callback('X: 1\r\nabc');
					expect(getter.pendingProcesses).toBe(0);
				});
				spyOn(getter, 'saveTuneInfo');
				getter.retrieveTuneInfo({
					sessionId: 1
				});
			});
			describe('extracting data from the abc file', function () {
				var abc,
					tuneSaver,
					init = function () {
						spyOn(getter, 'fetchPage').andCallFake(function (url, callback) {
							callback(abc);
						});
						spyOn(getter, 'saveTuneInfo');

						getter.retrieveTuneInfo({
							sessionId: 1
						});
					};

				describe('when data is as expected', function () {
					beforeEach(function () {
						abc = fs.readFileSync('./test/server/stubs/tune.abc', 'utf-8');
						init();
					});

					it('should be able to extract multiple abcs', function () {
						expect(getter.saveTuneInfo.mostRecentCall.args[0].arrangements.length).toBe(2);
					});

					it('should be able to extract meter', function () {
						expect(getter.saveTuneInfo.mostRecentCall.args[0].meter).toBe('4/4');
					});

					it('should be able to extract rhythm', function () {
						expect(getter.saveTuneInfo.mostRecentCall.args[0].rhythm).toBe('reel');
					});

					it('should be able to extract mode', function () {
						expect(getter.saveTuneInfo.mostRecentCall.args[0].mode).toBe('maj');
					});

					it('should be able to extract root', function () {
						expect(getter.saveTuneInfo.mostRecentCall.args[0].arrangements[0].root).toBe('G');
						expect(getter.saveTuneInfo.mostRecentCall.args[0].arrangements[1].root).toBe('Bb');
					});

					it('should be able to extract abc', function () {
						expect(getter.saveTuneInfo.mostRecentCall.args[0].arrangements[0].abc.replace(/(\n|\r)/g, '')).toBe('|: abc:||: abc:|');
					});

				});
				describe('when data is not as expected', function () {
					it('should cope well if the document appears not to contain any abc notation', function () {
						abc = 'have a banana';
						expect(init).not.toThrow();
					});
					it('should cope well if any data is missing from an abc', function () {
						abc = 'X: 1\r\nabc';
						expect(init).not.toThrow();
					});
				});
			});

		});

		describe('saveTuneInfo', function () {
			var tune;

			beforeEach(function () {
				tune = {
					save: jasmine.createSpy('tune save').andCallFake(function (callback) {
						callback();
					})
				};
				spyOn(getter, 'send');
			});


			it('should save the tune', function () {
				getter.saveTuneInfo(tune);
				expect(tune.save).toHaveBeenCalled();
			});

			it('should update the pending processes count', function () {
				tune.save = jasmine.createSpy('tune save', function (callback) {
					expect(getter.pendingProcesses).toBe(1);
					callback();
					expect(getter.pendingProcesses).toBe(0);
				});

				getter.saveTuneInfo(tune);

			});

			it ('should add the tune to the new tunes list', function () {
				getter.saveTuneInfo(tune);
				expect(getter.newTunes[0]).toBe(tune);
			});

			describe('sending a http response', function () {
				it('should send a response if no pending processes', function () {
					getter.pendingProcesses = 0;
					getter.saveTuneInfo(tune);
					expect(getter.send).toHaveBeenCalled();
				});

				it('should not send a response if there are still processes pending', function () {
					getter.pendingProcesses = 1;
					getter.saveTuneInfo(tune);
					expect(getter.send).not.toHaveBeenCalled();
				});
			});
		});

		describe('send', function () {
			it('should send a response', function () {
				getter.newTunes = ['tester'];
				getter.send();
				expect(getter.response.send).toHaveBeenCalledWith(['tester']);
				expect(getter.response.send.calls.length).toBe(1);


			});
		});

	});
});