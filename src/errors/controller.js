angular.module('prim').controller('errorHandler', function($scope, Utils) {

    $scope.errorcode = Utils.getError();

    if (angular.isUndefined($scope.errorcode) || angular.equals($scope.errorcode, "")) {
        $scope.errorcode = "???";
    }

    switch ($scope.errorcode) {
        case 401:
            $scope.page.setTitle("Unauthorized");
            break;
        case 404:
            $scope.page.setTitle("Not Found");
            break;
        case 502:
            $scope.page.setTitle("API Down");
            break;
        default:
            $scope.page.setTitle("Error");
            break;
    }

});
