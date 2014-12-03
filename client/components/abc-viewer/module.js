'use strict';

require('src/common/module');

var angular = require('angular'),
	tuneModule = angular.module('jnr.tune', ['jnr.common']);

module.exports = tuneModule
	.controller('tuneViewer', require('src/tune/controllers/tune-viewer'))
	.controller('addTune', require('src/tune/controllers/add-tune'))
	.filter('tuneStatSummary', require('src/tune/ui/tune-stat-summary'));