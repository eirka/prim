// IndexFormCtrl handles the page post form
angular.module('prim').controller('AvatarFormCtrl', function($scope, AuthService, Utils) {

    // using controllerAs
    var self = this;

    // generate post form action
    self.getFormAction = Utils.getFormAction;

    // get jwt token for form
    self.getToken = AuthService.getToken;

});
