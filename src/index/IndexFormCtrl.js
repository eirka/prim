// IndexFormCtrl handles the page post form
angular.module('prim').controller('IndexFormCtrl', function($scope, Utils) {

    // using controllerAs
    var self = this;

    // generate post form action
    self.getFormAction = Utils.getFormAction;

});
