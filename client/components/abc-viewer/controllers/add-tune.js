require('src/tune/ui/draw-score');
require('src/common/data/database');

module.exports = function (
	$scope,
	jTune
) {

	$scope.newTune = {
		performance: {}
	};

	$scope.save = function () {
		if (jTune.create($scope.newTune)) {
			$scope.$dismiss();
		}
	};

};