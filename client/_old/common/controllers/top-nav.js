module.exports = function (
    $scope, 
    $rootScope, 
    $location, 
    jPageState,
    jModals
) {
    $scope.currentUrl = $location.path();
    $scope.pageState = jPageState.get();
    $scope.isCollapsed = true;
    
    $rootScope.$on('locationChangeStart', function () {
        $scope.isCollapsed = true;
    });

    $scope.toggleNewTunes = function () {
        $rootScope.showNewTunes = !$rootScope.showNewTunes;
    };

    $scope.addTune = function () {
        jModals.open('addTune');
    };
};
