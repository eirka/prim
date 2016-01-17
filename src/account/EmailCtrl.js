// EmailCtrl updates the users email
angular.module('prim').controller('EmailCtrl', function($route, toaster, config, UserHandlers) {

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
            $route.reload();
        }, function(error) {
            toaster.pop('error', error.data.error_message);
        });
    };

});
