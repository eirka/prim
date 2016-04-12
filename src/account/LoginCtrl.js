// LoginCtrl logs a user in and sets the auth state and jwt token
angular.module('prim').controller('LoginCtrl', function($location, toaster, config, UserHandlers, AuthStorage, AuthSession) {

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
            AuthStorage.destroySession();
            // save token to storage
            AuthStorage.saveToken(self.success.token);
            // set the auth state from the token
            AuthSession.setAuthState();
            toaster.pop('success', data.success_message);
            // clear form
            self.form = {};
        }, function(error) {
            toaster.pop('error', error.data.error_message);
        });
    };

});
