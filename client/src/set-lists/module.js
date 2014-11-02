'use strict';

require('src/common/module');
require('src/set/module');

var angular = require('angular'),
    readCookie = require('src/common/services/read-cookie'),
    setModule = angular.module('jnr.set-lists', ['jnr.common', 'jnr.set']),
    listSets = require('src/set-lists/controllers/list-sets');
    // addTune = require('src/set/controllers/add-set');
        

module.exports = setModule
    .controller('listSets', listSets)
    .config(function ($routeProvider) {
    
        $routeProvider.when('/sets/list/', {
            templateUrl: '/src/set-lists/tpl/list-sets.html'
        }).when('/sets/list/:instrument', {
            templateUrl: '/src/set-lists/tpl/list-sets.html'
        });
    });