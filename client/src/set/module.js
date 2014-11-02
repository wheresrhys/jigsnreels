'use strict';

require('src/common/module');
require('src/tune/module');

var angular = require('angular'),
    setModule = angular.module('jnr.set', ['jnr.common', 'jnr.tune']);
    // setViewer = require('src/set/controllers/set-viewer'),
    // addTune = require('src/set/controllers/add-set');
        

module.exports = setModule;
    // .controller('setViewer', setViewer)
    // .controller('addTune', addTune);