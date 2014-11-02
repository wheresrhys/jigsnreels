'use strict';
var angular = require('angular');
require('angular-resource');

module.exports = angular.module('jnr.common', ['ngResource'])
    
    .directive('jSelectOnClick', require('./ui/select-on-click'))
    .filter('capitalise', require('./ui/capitalise'))
    .service('jModals', require('./ui/modals'))
    .service('readCookie', require('./services/read-cookie'))
    .service('jPageState', require('./services/page-state'))
    .service('jDatabase', require('./data/database'))
    .service('jDropdowns', require('./data/dropdowns'))
    .controller('topNav', require('./controllers/top-nav'))
;