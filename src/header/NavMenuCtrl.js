// NavMenuCtrl is the controller for nav menu
angular.module('prim').controller('NavMenuCtrl', function() {

    // using controllerAs
    var self = this;

    self.visible = false;

    // toggle menu visibility
    self.toggle = function() {
        self.visible = !self.visible;
    };

    self.open = function() {
        self.visible = true;
    };

    self.close = function() {
        self.visible = false;
    };

});
