// ThreadFormCtrl handles the page post form
angular.module('prim').controller('ThreadFormCtrl', function($scope, Utils) {

    // using controllerAs
    var self = this;

    // generate post form action
    self.getFormAction = Utils.getFormAction;

});
