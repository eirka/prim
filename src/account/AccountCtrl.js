// AccountCtrl gets the users whoami
angular.module('prim').controller('AccountCtrl', function($route, toaster, user_messages, AuthService, Utils) {

    // using controllerAs
    var self = this;

    // log out
    self.logOut = AuthService.logOut;

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
        }

    });

});
