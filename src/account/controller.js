angular.module('prim').controller('AccountCtrl', function($scope, $route, AuthService) {

    // using controllerAs
    var self = this;

    // get whoami
    AuthService.queryWhoAmI().$promise.then(function(data) {
        self.whoami = {
            id: data.user.id,
            name: data.user.name,
            group: data.user.group,
            email: data.user.email
        };
    });

    // log out
    self.logOut = function() {
        AuthService.destroySession();
        $route.reload()
    }

});

angular.module('prim').controller('PasswordCtrl', function(config, internal, PasswordHandler) {

    // using controllerAs
    var self = this;

    // Function for registering an account
    self.changePassword = function() {
        self.error = "";
        self.success = "";
        PasswordHandler.save({
            ib: config.ib_id,
            oldpw: self.oldpassword,
            newpw: self.newpassword
        }, function(data) {
            self.success = data;
        }, function(error) {
            self.error = error.data;
        });
    };

});


angular.module('prim').controller('RegisterCtrl', function(config, internal, RegisterHandler) {

    // using controllerAs
    var self = this;

    // Function for registering an account
    self.newUser = function() {
        self.error = "";
        self.success = "";
        RegisterHandler.save({
            ib: config.ib_id,
            askey: internal.as_key,
            name: self.name,
            email: self.email,
            password: self.password
        }, function(data) {
            self.success = data;
        }, function(error) {
            self.error = error.data;
        });
    };

});

angular.module('prim').controller('LoginCtrl', function($location, config, internal, LoginHandler, AuthService) {

    // using controllerAs
    var self = this;

    // Function for logging in
    self.logIn = function() {
        self.error = "";
        self.success = "";
        LoginHandler.save({
            ib: config.ib_id,
            askey: internal.as_key,
            name: self.name,
            password: self.password
        }, function(data) {
            self.success = data;
            // get rid of any prior state
            AuthService.destroySession();
            // save token to storage
            AuthService.saveToken(self.success.token);
            // set the auth state from the token
            AuthService.setAuthState();
        }, function(error) {
            self.error = error.data;
        });
    };

});
