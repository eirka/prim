angular.module('prim').controller('AccountCtrl', function($route, toaster, user_messages, AuthService, Utils) {

    // using controllerAs
    var self = this;

    // get whoami
    AuthService.queryWhoAmI().$promise.then(function(data) {

        // set local whoami data
        self.whoami = {
            id: data.user.id,
            name: data.user.name,
            group: data.user.group,
            avatar: Utils.getAvatar(data.user.avatar),
            email: data.user.email
        };

        // set text if theres no email
        if (angular.equals(self.whoami.email, "")) {
            self.whoami.email = user_messages.noEmail;
        };

    });

    // log out
    self.logOut = function() {
        AuthService.destroySession();
        $route.reload()
        toaster.pop('success', user_messages.loggedOut);
    }

});

angular.module('prim').controller('PasswordCtrl', function(toaster, config, internal, UserHandlers) {

    // using controllerAs
    var self = this;

    // Function for registering an account
    self.changePassword = function() {
        UserHandlers.password.save({
            ib: config.ib_id,
            oldpw: self.form.oldpassword,
            newpw: self.form.newpassword
        }, function(data) {
            toaster.pop('success', data.success_message);
            // clear form 
            self.form = {};
        }, function(error) {
            toaster.pop('error', error.data.error_message);
        });
    };

});

angular.module('prim').controller('EmailCtrl', function($route, toaster, config, internal, UserHandlers) {

    // using controllerAs
    var self = this;

    // Function for registering an account
    self.updateEmail = function() {
        UserHandlers.email.save({
            ib: config.ib_id,
            email: self.form.email
        }, function(data) {
            toaster.pop('success', data.success_message);
            // clear form 
            self.form = {};
            // reload
            $route.reload()
        }, function(error) {
            toaster.pop('error', error.data.error_message);
        });
    };

});

angular.module('prim').controller('RegisterCtrl', function(toaster, config, internal, UserHandlers) {

    // using controllerAs
    var self = this;

    // Function for registering an account
    self.newUser = function() {
        UserHandlers.register.save({
            ib: config.ib_id,
            askey: internal.as_key,
            name: self.form.name,
            email: self.form.email,
            password: self.form.password
        }, function(data) {
            toaster.pop('success', data.success_message);
            // clear form 
            self.form = {};
        }, function(error) {
            toaster.pop('error', error.data.error_message);
        });
    };

});

angular.module('prim').controller('LoginCtrl', function($location, toaster, config, internal, UserHandlers, AuthService) {

    // using controllerAs
    var self = this;

    // Function for logging in
    self.logIn = function() {
        UserHandlers.login.save({
            ib: config.ib_id,
            askey: internal.as_key,
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
