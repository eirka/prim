// ThreadFormCtrl handles the page post form
angular.module('prim').controller('ThreadFormCtrl', function($scope, AuthStorage, Utils) {

    // using controllerAs
    var self = this;

    // generate post form action
    self.getFormAction = Utils.getFormAction;

    // get jwt token for form
    self.getToken = AuthStorage.getToken;

});
