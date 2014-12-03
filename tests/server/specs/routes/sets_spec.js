var format = require('util').format;
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var ObjectId = mongoose.Types.ObjectId;
var sinon = require('sinon');
var request = require('supertest');
var app = require('../../../../server/app');

var modelName = 'set';
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
						expect(res.body[0].tunesAdded).toBeTruthy();
						done();
					});
			});
	});
	it('should get a record', function (done) {
		Model.create([{}, {}])
			.then(function (set1) {
				request(app)
					.get(format('/api/%ss/%s', modelName, set1._id))
					.expect(200)
					.end(function (err, res) {
						expect(res.body._id).toEqual(set1._id.toString());
						expect(res.body.tunesAdded).toBeTruthy();
						done();
					});
			});
	});
	it('should create record', function (done) {
		request(app)
			.post(format('/api/%ss', modelName))
			.send({
				name: 'test name',
				tunes: ['547b75a0c78538b0346f8887'],
				keys: ['Dmaj']
			})
			.expect(200)
			.end(function (err, res) {
				expect(typeof res.body._id).toEqual('string');
				expect(res.body.name).toEqual('test name');
				expect(res.body.tunes).toEqual(['547b75a0c78538b0346f8887']);
				expect(res.body.keys).toEqual(['Dmaj']);
				expect(res.body.pieceAdded).toBeTruthy();
				Model.find().exec()
					.then(function (results) {
						expect(results.length).toEqual(1);
						done();
					});
			});
	});

	it('should update record', function (done) {
		Model.create([{}])
			.then(function (set) {
				setTimeout(function () {
					request(app)
						.put(format('/api/%ss/%s', modelName, set._id))
						.send({
							name: 'new name'
						})
						.expect(200)
						.end(function (err, res) {
							expect(res.body.name).toBe('new name');
							done();
						});
				}, 50);
			});
	});
	it('should delete record', function (done) {
		Model.create([{}, {}])
			.then(function (set1, set2) {
				request(app)
					.delete(format('/api/%ss/%s', modelName, set1._id))
					.expect(200)
					.end(function (err, res) {
						expect(res.body.cleanlyRemoved).toBeTruthy();
						done();
					});
			});
	});

});