// PasswordCtrl updates the users password
angular.module('prim').controller('PasswordCtrl', function(toaster, config, UserHandlers) {

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
