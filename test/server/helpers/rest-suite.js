var mongoose = require('mongoose'),
    httpMocks = require('express-mocks-http'),
    ObjectId = mongoose.Types.ObjectId;


var Suite = function (conf) {
    this.conf = conf;
    this.init();
};

Suite.prototype = {
    init: function () {
        this.router = require('../../../server/routes/' + this.conf.resource + 's');
    },
    run: function () {
        var that = this;
        describe('routes/' + this.conf.resource + 's', function () {
            that.beforeEach();
            that.testFetchAll();
            that.testFindById();
            that.testAdd();
            that.testUpdate();
            that.conf.additionalTests && that.conf.additionalTests();
        });
    },
    beforeEach: function () {
        this.Model = require('../../../server/models/' + this.conf.resource);
    },
    testFetchAll: function () {
        var that = this;

        it('should fetch all records', function () {
            var request  = httpMocks.createRequest({
                method: 'GET',
                url: '/rest/' + that.conf.resource + 's'
            });
            var response = httpMocks.createResponse();

            spyOn(that.Model, 'find').andCallFake(function () {
                response.send('foundAll');
            });
            spyOn(response, 'send');
            that.router.fetchAll(request, response);
            expect(that.Model.find).lastCalledWith({});
            expect(response.send).toHaveBeenCalledWith('foundAll');
            
        });
    },
    testFindById: function () {
        var that = this;

        it('should fetch a record by its ID', function () {
            var request  = httpMocks.createRequest({
                method: 'GET',
                url: '/rest/' + that.conf.resource + 's/111111111111'
            });
            var response = httpMocks.createResponse();

            spyOn(that.Model, 'findOne').andCallFake(function () {
                response.send('foundOne');
            });
            spyOn(response, 'send');
            that.router.findById(request, response);
            expect(that.Model.findOne.mostRecentCall.args[0]._id._bsontype).toBe('ObjectID');
            expect(response.send).toHaveBeenCalledWith('foundOne');
            
        });
    },
    testAdd: function () {
        var that = this;

        it('should add a record', function () {
            var request  = httpMocks.createRequest({
                method: 'POST',
                url: '/rest/' + that.conf.resource + 's',
                body: {
                    name: 'name'
                }
            });
            var response = httpMocks.createResponse();

            spyOn(that.Model, 'create').andCallFake(function () {
                response.send('created');
            });
            spyOn(response, 'send');
            that.router.add(request, response);
            expect(that.Model.create).lastCalledWith({
                name: 'name'
            });
            expect(response.send).toHaveBeenCalledWith('created');
            
        });
    },
    testUpdate: function () {
        var that = this;

        it('should update a record', function () {
            var request  = httpMocks.createRequest({
                method: 'PUT',
                url: '/rest/' + that.conf.resource + 's/111111111111',
                body: {
                    name: 'name'
                }
            });
            var response = httpMocks.createResponse();

            spyOn(that.Model, 'update').andCallFake(function () {
                response.send('updated');
            });
            spyOn(response, 'send');
            that.router.update(request, response);
            expect(that.Model.update.mostRecentCall.args[1]).toEqual({
                name: 'name'
            });
            expect(response.send).toHaveBeenCalledWith('updated');
            
        });
    }
};

module.exports = Suite;