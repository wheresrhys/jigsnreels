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
var TuneModel = require('../../../../server/models/tune');
var PieceModel = require('../../../../server/models/piece');
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
	it('should get a record with its tunes', function (done) {
		TuneModel.create({
			name: 'testname1'
		})
			.then(function (tune) {
				Model.create({
					tunes: [tune._id]
				})
				.then(function (set1) {
					request(app)
						.get(format('/api/%ss/%s', modelName, set1._id))
						.expect(200)
						.end(function (err, res) {
							expect(res.body._id).toEqual(set1._id.toString());
							expect(res.body.tunes[0].name).toBe('testname1');
							done();
						});
				});
			});
	});


	it('should create record', function (done) {
		TuneModel.create({
			name: 'testname1'
		})
			.then(function (tune) {
				request(app)
					.post(format('/api/%ss', modelName))
					.send({
						name: 'test name',
						tunes: [tune._id.toString()],
						keys: ['Dmaj']
					})
					.expect(200)
					.end(function (err, res) {
						expect(typeof res.body._id).toEqual('string');
						expect(res.body.name).toEqual('test name');
						expect(res.body.tunes).toEqual([tune._id.toString()]);
						expect(res.body.keys).toEqual(['Dmaj']);
						Promise.all([Model.find().exec(), PieceModel.find().exec()])
							.then(function (results) {
								expect(results[0].length).toEqual(1);
								expect(results[1].length).toEqual(0);
								done();
							});
					});
			});
	});

	it('should create record with a piece if requested', function (done) {
		TuneModel.create({
			name: 'testname1'
		})
			.then(function (tune) {
				request(app)
					.post(format('/api/%ss?tunebook=test-tunes', modelName))
					.send({
						name: 'test name',
						tunes: [tune._id.toString()],
						keys: ['Dmaj']
					})
					.expect(200)
					.end(function (err, res) {
						expect(typeof res.body._id).toEqual('string');
						expect(res.body.name).toEqual('test name');
						expect(res.body.tunes).toEqual([tune._id.toString()]);
						expect(res.body.keys).toEqual(['Dmaj']);
						Promise.all([Model.find().exec(), PieceModel.find().exec()])
							.then(function (results) {
								expect(results[0].length).toEqual(1);
								expect(results[1].length).toEqual(1);
								expect(results[1][0].tunebook).toEqual('wheresrhys:test-tunes');
								done();
							});
					});
			});
	});

	it('should update record', function (done) {
		Model.create({})
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
			.then(function (sets) {
				PieceModel.create({
					srcId: sets[0]._id.toString()
				}).then(function (set) {
						request(app)
							.delete(format('/api/%ss/%s', modelName, sets[0]._id))
							.expect(200)
							.end(function (err, res) {
								Promise.all([Model.find().exec(), PieceModel.find().exec()])
									.then(function (things) {
										expect(things[0].length).toBe(1);
										expect(things[1].length).toBe(0);
										done();
									})
							});
					});
			});
	});

});