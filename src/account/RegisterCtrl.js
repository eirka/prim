// RegisterCtrl submits a user registration request
angular.module('prim').controller('RegisterCtrl', function(toaster, config, UserHandlers) {

    // using controllerAs
    var self = this;

    // Function for registering an account
    self.newUser = function() {
        UserHandlers.register.save({
            ib: config.ib_id,
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
