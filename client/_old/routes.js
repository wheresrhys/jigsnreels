// 'use strict';

// var readCookie = require('src/common/read-cookie');

// module.exports = function () {

//     require('angular').module('jnr').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        
//         $locationProvider.html5Mode(true).hashPrefix('!');   

//         $routeProvider.when('/tunes', {
//             templateUrl: '/views/list-tunes.html'
//         }).when('/tunes/:instrument', {
//             templateUrl: '/views/list-tunes.html'
//         // }).when('/tune/:id', {
//         //     templateUrl: '/views/tune.html'
//         // }).when('/tune/:id/:instrument', {
//         //     templateUrl: '/views/tune.html'
//         // }).when('/sets/new/', {
//         //     templateUrl: '/views/set-builder.html'
//         // }).when('/sets/list/', {
//         //     templateUrl: '/views/set-list.html'
//         // }).when('/sets/new/:instrument', {
//         //     templateUrl: '/views/set-builder.html'
//         // }).when('/sets/list/:instrument', {
//         //     templateUrl: '/views/set-list.html'
//         }).otherwise({
//             redirectTo: '/tunes/' + ( readCookie('instrument') || 'mandolin')
//         });
//     }]);
// };

    
