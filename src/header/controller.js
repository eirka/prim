// controller for nav menu
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

angular.module('prim').controller('UserMenuCtrl', function($route, toaster, user_messages, AuthService, Utils) {

    // using controllerAs
    var self = this;

    self.visible = false;

    // if mod controls should be shown or not
    self.showModControls = AuthService.showModControls;

    // get usergroup class
    self.usergroupClass = Utils.usergroupClass;

    // log out
    self.logOut = AuthService.logOut;

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
