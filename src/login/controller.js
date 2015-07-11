angular.module('prim').controller('LoginCtrl', function(config, internal, LoginHandler, AuthService) {

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
            // save token to storage
            AuthService.saveToken(self.success.token);
            // set the auth state from the token
            AuthService.setAuthState();
        }, function(error) {
            self.error = error.data;
            // destroy current session
            AuthService.destroySession();
        });
    };

});
