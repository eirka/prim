// UserMenuCtrl is the controller for the user menu
angular.module('prim').controller('UserMenuCtrl', function($route, toaster, user_messages, AuthUtils, AuthSession, Utils) {

    // using controllerAs
    var self = this;

    self.visible = false;

    // if mod controls should be shown or not
    self.showModControls = AuthUtils.showModControls;

    // get usergroup class
    self.usergroupClass = Utils.usergroupClass;

    // log out
    self.logOut = AuthSession.logOut;

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
