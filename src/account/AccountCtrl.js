// AccountCtrl gets the users whoami
angular.module('prim').controller('AccountCtrl', function($route, toaster, user_messages, AuthSession, Utils, config) {

    // using controllerAs
    var self = this;

    // set csrf token
    self.csrf_token = config.csrf_token;

    // log out
    self.logOut = AuthSession.logOut;

    // the list of panels
    self.panels = [{
        name: 'Account',
        template: 'pages/account/settings_account.html'
    }, {
        name: 'Avatar',
        template: 'pages/account/settings_avatar.html'
    }];

    // the default panel
    self.panel = self.panels[0].template;

    // panel switcher
    self.switchPanel = function(name) {
        if (angular.isDefined(name)) {
            angular.forEach(self.panels, function(panel) {
                if (angular.equals(panel.name, name)) {
                    self.panel = panel.template;
                }
            });
        }
        return;
    };

    // check if tab is active
    self.isActive = function(panel) {
        return angular.equals(panel.template, self.panel);
    };

    // get whoami
    AuthSession.queryWhoAmI().$promise.then(function(data) {

        // set local whoami data
        self.whoami = {
            id: data.user.id,
            name: data.user.name,
            group: data.user.group,
            avatar: Utils.getAvatar(data.user.id),
            email: data.user.email
        };

        // set text if theres no email
        if (angular.equals(self.whoami.email, "")) {
            self.whoami.email = user_messages.noEmail;
        }

    });

});
