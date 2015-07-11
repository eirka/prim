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
