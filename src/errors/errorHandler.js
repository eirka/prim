// errorHandler is the controller for the error page
angular.module('prim').controller('errorHandler', function($scope, Utils) {

    // using controllerAs
    var self = this;

    // get the stored error code 
    self.errorcode = Utils.getError();

    if (angular.isUndefined(self.errorcode) || angular.equals(self.errorcode, "")) {
        self.errorcode = 404;
    }

    if (angular.equals(self.errorcode, -1)) {
        self.errorcode = 502;
    }

    switch (self.errorcode) {
        case 401 || 403:
            self.errormessage = "You are unauthorized to view this page";
            $scope.page.setTitle("Unauthorized");
            break;
        case 404:
            self.errormessage = "Couldn't find whatever you were looking for";
            $scope.page.setTitle("Not Found");
            break;
        case 502:
            self.errormessage = "Oh no the API server is probably down";
            $scope.page.setTitle("API Down");
            break;
        default:
            self.errormessage = "Looks like something went wrong";
            $scope.page.setTitle("Error");
            break;
    }

});
