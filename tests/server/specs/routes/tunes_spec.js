var format = require('util').format;
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var ObjectId = mongoose.Types.ObjectId;
var sinon = require('sinon');
var request = require('supertest');
var app = require('../../../../server/app');

var modelName = 'tune';
var router = require(format('../../../../server/routes/%ss', modelName));
var Model = require(format('../../../../server/models/%s', modelName));
var schema = require(format('../../../../server/models/schemas/%s', modelName));

describe(format('api - %ss', modelName), function () {

	afterEach(function () {
		mockgoose.reset();
	});

	it('should fetch all records', function (done) {
		Model.create([{}, {}])
			.then(function () {
				request(app)
					.get(format('/api/%ss', modelName))
					.expect(200)
					.end(function (err, res) {
						expect(res.body.length).toEqual(2);
						done();
					});
			});
	});

	it('should get a record', function (done) {
		Model.create([{}, {}])
			.then(function (tune1) {
				request(app)
					.get(format('/api/%ss/%s', modelName, tune1._id))
					.expect(200)
					.end(function (err, res) {
						expect(res.body._id).toEqual(tune1._id.toString());
						done();
					});
			});
	});

	it('should create record', function (done) {
		request(app)
			.post(format('/api/%ss', modelName))
			.send({
				sessionId: 12345,
				oldId: '547b75a0c78538b0346f8887',
				name: 'fiddledeedee',
				meters: ['4/4'],
				keys: ['Gmaj'],
				rhythms: ['reel'],
				abcId: '547b75a0c78538b0346f8887',
				abc: 'T:fiddledeedee\nabc'
			})
			.expect(200)
			.end(function (err, res) {
				expect(typeof res.body._id).toEqual('string');
				expect(res.body.sessionId).toEqual(12345);
				expect(res.body.oldId).toEqual('547b75a0c78538b0346f8887');
				expect(res.body.name).toEqual('fiddledeedee');
				expect(res.body.abcId).toEqual('547b75a0c78538b0346f8887');
				expect(res.body.abc).toEqual('T:fiddledeedee\nabc');
				expect(res.body.arrangements).toEqual([]);
				expect(res.body.meters).toEqual(['4/4']);
				expect(res.body.keys).toEqual(['Gmaj']);
				expect(res.body.rhythms).toEqual(['reel']);
				expect(res.body.quality).toEqual(-1);
				expect(res.body.author).toEqual('trad arr.');

				Model.find().exec()
					.then(function (results) {
						expect(results.length).toEqual(1);
						done();
					});
			});
	});

	it('should update record', function (done) {
		Model.create([{}])
			.then(function (tune) {
				setTimeout(function () {
					request(app)
						.put(format('/api/%ss/%s', modelName, tune._id))
						.send({
							quality: 3
						})
						.expect(200)
						.end(function (err, res) {
							expect(res.body.quality).toBe(3);
							done();
						});
				}, 50);
			});
	});

	xit('should delete record', function (done) {
		Model.create([{}, {}])
			.then(function (tune1, tune2) {
				request(app)
					.delete(format('/api/%ss/%s', modelName, tune1._id))
					.expect(200)
					.end(function (err, res) {
						expect(res.body).toEqual({});
						Model.find().exec()
							.then(function (results) {
								expect(results.length).toEqual(1);
								expect(results[0]._id.toString()).toEqual(tune2._id.toString());
								done();
							});
					});
			});
	});

});