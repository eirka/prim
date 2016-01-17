// LoginCtrl logs a user in and sets the auth state and jwt token
angular.module('prim').controller('LoginCtrl', function($location, toaster, config, UserHandlers, AuthService) {

    // using controllerAs
    var self = this;

    // Function for logging in
    self.logIn = function() {
        UserHandlers.login.save({
            ib: config.ib_id,
            name: self.form.name,
            password: self.form.password
        }, function(data) {
            self.success = data;
            // get rid of any prior state
            AuthService.destroySession();
            // save token to storage
            AuthService.saveToken(self.success.token);
            // set the auth state from the token
            AuthService.setAuthState();
            toaster.pop('success', data.success_message);
            // clear form 
            self.form = {};
        }, function(error) {
            toaster.pop('error', error.data.error_message);
        });
    };

});
