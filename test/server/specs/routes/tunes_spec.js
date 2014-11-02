require('../../helpers/config.js');
require('../../../jasmine.jnr.js');
var app = require('../../../../server/app.js'),
    request = require('request'),
    Suite = require('../../helpers/rest-suite.js'),
    suite = new Suite({
        resource: 'tune'
    });

suite.run();