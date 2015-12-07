// controller for nav menu
angular.module('prim').controller('NavMenuCtrl', function($route, toaster, user_messages, AuthService) {

    // using controllerAs
    var self = this;

    self.visible = false;

    // toggle menu visibility
    self.toggle = function() {
        self.visible = !self.visible;
    }

    self.open = function() {
        self.visible = true;
    }

    self.close = function() {
        self.visible = false;
    }

});

angular.module('prim').controller('UserMenuCtrl', function($route, toaster, user_messages, AuthService, Utils) {

    // using controllerAs
    var self = this;

    self.visible = false;

    self.usergroupClass = Utils.usergroupClass;

    // toggle menu visibility
    self.toggle = function() {
        self.visible = !self.visible;
    }

    self.open = function() {
        self.visible = true;
    }

    self.close = function() {
        self.visible = false;
    }

    // log out
    self.logOut = function() {
        AuthService.destroySession();
        $route.reload()
        toaster.pop('success', user_messages.loggedOut);
    }

});
