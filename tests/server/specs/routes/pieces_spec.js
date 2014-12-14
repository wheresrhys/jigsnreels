var format = require('util').format;
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var ObjectId = mongoose.Types.ObjectId;
var sinon = require('sinon');
var request = require('supertest');
var app = require('../../../../server/app');

var modelName = 'piece';
var router = require(format('../../../../server/routes/%ss', modelName));
var Model = require(format('../../../../server/models/%s', modelName));
var TuneModel = require('../../../../server/models/tune');
var SetModel = require('../../../../server/models/set');
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

	it('should get a record with tune', function (done) {
		TuneModel.create({
			name: 'testname1'
		})
		.then(function (tune){
			Model.create({
				srcId: tune._id,
				type: 'tune'
			})
			.then(function (piece1) {
				request(app)
					.get(format('/api/%ss/%s', modelName, piece1._id))
					.expect(200)
					.end(function (err, res) {
						expect(res.body._id).toEqual(piece1._id.toString());
						expect(res.body.src.name).toBe('testname1');
						done();
					});
			});
		});
	});
	it('should get a record with set', function (done) {
		SetModel.create({
			name: 'testname2'
		})
		.then(function (set){
			Model.create({
				srcId: set._id,
				type: 'set'
			})
			.then(function (piece1) {
				request(app)
					.get(format('/api/%ss/%s', modelName, piece1._id))
					.expect(200)
					.end(function (err, res) {
						expect(res.body._id).toEqual(piece1._id.toString());
						expect(res.body.src.name).toBe('testname2');
						done();
					});
			});
		});
	});

	it('should create record', function (done) {
		request(app)
			.post(format('/api/%ss', modelName))
			.send({
				type: 'tune',
				srcId: '547b75a0c78538b0346f8887'
			})
			.expect(200)
			.end(function (err, res) {
				expect(res.body.type).toEqual('tune');
				expect(res.body.srcId).toEqual('547b75a0c78538b0346f8887');
				expect(typeof res.body.lastPracticed).toBe('undefined');
				expect(typeof new Date(res.body.lastPracticed).getTime()).toBe('number');
				expect(res.body.stickiness).toEqual(0);
				expect(res.body.lastPracticeQuality).toEqual(0);
				expect(typeof res.body._id).toEqual('string');
				Model.find().exec()
					.then(function (results) {
						expect(results.length).toEqual(1);
						done();
					});
			});
	});

	it('should update record', function (done) {
		Model.create([{}])
			.then(function (piece) {
				setTimeout(function () {
					request(app)
						.put(format('/api/%ss/%s', modelName, piece._id))
						.send({
							stickiness: 5
						})
						.expect(200)
						.end(function (err, res) {
							expect(res.body.stickiness).toBe(5);
							expect(typeof res.body.lastPracticed).toBe('string');
							expect(typeof new Date(res.body.lastPracticed).getTime()).toBe('number');
							done();
						});
				}, 50);
			});
	});
	it('should delete record', function (done) {
		Model.create([{}, {}])
			.then(function (piece1, piece2) {
				request(app)
					.delete(format('/api/%ss/%s', modelName, piece1._id))
					.expect(200)
					.end(function (err, res) {
						expect(res.body).toEqual({});
						Model.find().exec()
							.then(function (results) {
								expect(results.length).toEqual(1);
								expect(results[0]._id.toString()).toEqual(piece2._id.toString());
								done();
							});
					});
			});
	});

});