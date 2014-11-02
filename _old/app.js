var angular = require('angular');

require('src/tune-lists/module');
require('src/set-lists/module');
require('angular-bootstrap');
require('angular-resource');
require('angular-cookies');
require('angular-route');
require('angular-animate');

var app = angular.module('jnr', [
    'ngResource',
    'ngCookies',
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'jnr.tune-lists',
    'jnr.set-lists'
]);

app.value('jNow', new Date())
    .config(function ($locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');   
    });

module.exports = app
 .config(function ($routeProvider) {
    
        $routeProvider.otherwise({
            redirectTo: '/sets/list/mandolin'
        });
    });

 