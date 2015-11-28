angular.module('prim').controller('errorHandler', function($scope, Utils) {

    // using controllerAs
    var self = this;

    // get the stored error code 
    self.errorcode = Utils.getError();

    if (angular.isUndefined(self.errorcode) || angular.equals(self.errorcode, "")) {
        self.errorcode = "???";
    }

    if (angular.equals(self.errorcode, -1)) {
        self.errorcode = 502;
    }

    switch (self.errorcode) {
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
