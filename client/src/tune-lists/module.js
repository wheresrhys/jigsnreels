'use strict';

require('src/common/module');
require('src/tune/module');

var angular = require('angular'),
    tuneListsModule = angular.module('jnr.tune-lists', ['jnr.common', 'jnr.tune']),
    readCookie = require('src/common/services/read-cookie'),
    listTunes = require('src/tune-lists/controllers/list-tunes'),
    newTunes = require('src/tune-lists/controllers/new-tunes');
        
module.exports = tuneListsModule
    .controller('listTunes', listTunes)
    .controller('newTunes', newTunes)
    .config(function ($routeProvider) {
    
        $routeProvider.when('/tunes', {
            templateUrl: '/src/tune-lists/tpl/list-tunes.html'
        }).when('/tunes/:instrument', {
            templateUrl: '/src/tune-lists/tpl/list-tunes.html'
        });
    });

