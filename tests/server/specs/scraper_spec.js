// require('../../../jasmine.jnr.js');
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);
var request = require('supertest');
var sinon = require('sinon');
var nock = require('nock');
var Tune = require('../../../server/models/tune');
var Arrangement = require('../../../server/models/arrangement');
var Scraper = require('../../../server/lib/scraper');
var fs = require('fs');
var abc = fs.readFileSync('./tests/fixtures/thesession/tune.abc', 'utf-8');
var page = fs.readFileSync('./tests/fixtures/thesession/tunebook.html', 'utf-8');
var dummyId = '547b75a0c78538b0346f887f';

describe('scraper', function () {

	var scraper;

	beforeEach(function () {
		scraper = new Scraper();
	});

	afterEach(function () {
		mockgoose.reset();
	});

	it('should fetch multiple pages of the tunebook if paginated', function (done) {

		nock('https://thesession.org')
			.filteringPath(/\/.*/, '/XXX')
			.get('/XXX')
			.times(2)
			.reply(200, page);

		sinon.stub(scraper, 'processTuneList');
		scraper.getNewTunes();
		setTimeout(function () {
			expect(scraper.processTuneList.callCount).toBeGreaterThan(1);
			expect(scraper.processTuneList.getCalls()[0].args[0].body).toEqual(page);
			scraper.processTuneList.restore();
			done();
		}, 50)
	});


	it('should process each tune on a page', function () {
		sinon.stub(scraper, 'storeTune');
		scraper.processTuneList({
			body: page
		});
		expect(scraper.storeTune.callCount).toBeGreaterThan(10);
		expect(typeof scraper.storeTune.getCalls()[0].args[0].sessionId).toBe('number');
		expect(typeof scraper.storeTune.getCalls()[0].args[0].name).toBe('string');
		scraper.storeTune.restore();
	});

	it('should create tune if new', function (done) {
		sinon.stub(scraper, 'retrieveTuneInfo', function () {
			return Promise.resolve({});
		});
		scraper.storeTune({
			sessionId: 123,
			name: 'new'
		})
			.then(function () {
				Tune.find().exec()
					.then(function (tunes) {
						expect(tunes.length).toBe(1);
						expect(tunes[0].sessionId).toBe(123);
						expect(scraper.retrieveTuneInfo.calledOnce).toBeTruthy();
						scraper.retrieveTuneInfo.restore();
						done();
					})
			})
	});

	it('should retrieve existing tune if exists', function (done) {
		sinon.stub(scraper, 'retrieveTuneInfo', function () {
			return Promise.resolve({});
		});
		Tune.create({
			sessionId: 123,
			name: 'old'
		})
			.then(function () {
				scraper.storeTune({
					sessionId: 123,
					name: 'new'
				})
					.then(function () {
						Tune.find().exec()
							.then(function (tunes) {
								expect(tunes.length).toBe(1);
								expect(tunes[0].name).toBe('old');
								expect(scraper.retrieveTuneInfo.calledOnce).toBeTruthy();
								scraper.retrieveTuneInfo.restore();
								done();
							})
					})
			})
	});

	it('should not get extra tune info if already complete', function (done) {
		sinon.stub(scraper, 'retrieveTuneInfo', function () {
			return Promise.resolve({});
		});
		Tune.create({
			sessionId: 123,
			name: 'old',
			arrangements: [dummyId]
		})
			.then(function () {
				scraper.storeTune({
					sessionId: 123,
					name: 'new'
				})
					.then(function () {
						Tune.find().exec()
							.then(function (tunes) {
								expect(tunes.length).toBe(1);
								expect(scraper.retrieveTuneInfo.called).toBeFalsy();
								scraper.retrieveTuneInfo.restore();
								done();
							})
					})
			})
	});

	it('should fetch abc file from the session', function (done) {
		var mock = nock('https://thesession.org')
			.filteringPath(/^\/tunes\/\d+\/abc$/, '/tunes/XXX/abc')
			.get('/tunes/XXX/abc')
			.reply(200, abc);

		var tune = {
			sessionId: 123
		};

		sinon.stub(scraper, 'storeAbc');
		scraper.retrieveTuneInfo(tune);
		setTimeout(function () {
			expect(mock.isDone()).toBeTruthy();
			expect(scraper.storeAbc.calledOnce).toBeTruthy();
			expect(scraper.storeAbc.calledWith(tune, abc)).toBeTruthy();
			scraper.storeAbc.restore();
			done();
		}, 50)
	});


	describe('extracting data from the abc file', function () {
		var tune;
		var ObjectId = mongoose.Types.ObjectId;

		beforeEach(function (done) {
			Tune.create({}).then(function (t) {
				tune = t;
				done();
			})
		});

		it('should work \'in the wild\'', function (done) {
			scraper.storeAbc(tune, abc)
				.then(function () {
					expect(tune.keys.length).toBeGreaterThan(0);
					expect(tune.keys[0]).toMatch(/^[ABCDEFG](#|b)?[a-z]{3}$/);
					expect(tune.meters.length).toBeGreaterThan(0);
					expect(tune.rhythms.length).toBeGreaterThan(0);
					expect(tune.abcId instanceof ObjectId).toBeTruthy();
					expect(typeof tune.abc).toEqual('string')
					expect(tune.arrangements[0] instanceof ObjectId).toBeTruthy();

					Arrangement.find().exec()
						.then(function (arrs) {
							expect(arrs.length).toBeGreaterThan(0);

							expect(arrs[0].meter).toMatch(/^\d{1,2}\/\d{1,2}$/);
							expect(typeof arrs[0].rhythm).toBe('string');
							expect(arrs[0].mode).toMatch(/^[a-z]{3}$/);
							expect(arrs[0].root).toMatch(/^[ABCDEFG](#|b)?$/);
							expect(typeof arrs[0].abc).toBe('string');
							expect(arrs[0].tune).toEqual(tune._id);
							done();
						});
				});
		});

		it('should cope well if the document does not contain abc', function (done) {
			scraper.storeAbc(tune, 'have a banana')
				.then(function () {
					expect(tune.keys).toEqual([]);
					Arrangement.find().exec()
						.then(function (arrs) {
							expect(arrs.length).toBe(0);
							done();
						});
				});
		});



		it('should be able to identify a tune\'s normal key', function () {
			scraper.storeAbc(tune, 'X: 1\r\nK:Emin\r\nX: 2\r\nK:Gmaj\r\nX: 3\r\nK:Gmaj\r\n')
				.then(function () {
					expect(tune.keys).toEqual(['Gmaj', 'Emin']);
				})
		});

	});
});