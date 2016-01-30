// NavItemsCtrl is the controller for nav items in the header
angular.module('prim').controller('NavItemsCtrl', function($location) {

    // using controllerAs
    var self = this;

    // check if the tab matches and active route
    self.isActive = function(route) {
        return route === $location.path().split('/')[1];
    };

});
