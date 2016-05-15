// provides functions for setting the users auth session
angular.module('prim').factory('AuthSession', function($route, toaster, user_messages, AuthStorage, AuthState, BoardData, Handlers, Utils, UserHandlers) {

    var AuthSession = {
        // promise to the whoami handler
        queryWhoAmI: function() {
            return Handlers.whoami.get();
        },
        // handles the creation of key and cache store and also queries whoami handler for fresh info
        setAuthState: function() {
            // get the cached user data for smooth loading
            var cas = AuthStorage.getUserCache();
            // get the cached ib data
            var cib = BoardData.getIbData();

            // set our state to the cached version, or default if it isnt there
            if (cas && cib) {
                AuthState.set(cas.id, cas.name, cas.isAuthenticated, cas.avatar, cas.lastactive);
                BoardData.set(cib.group);
            } else {
                AuthState.default();
                BoardData.default();
            }

            // query whoami for user data
            AuthSession.queryWhoAmI().$promise.then(function(data) {
                var ss = data.user;

                // if there is a cached state but we're not authed server side
                if (cas && !ss.authenticated) {
                    AuthStorage.destroySession();
                    return;
                }

                // set auth state from whois information if authenticated
                if (ss.authenticated) {
                    AuthState.set(ss.id, ss.name, true, Utils.getAvatar(ss.id), new Date(ss.last_active));
                    // cache user data
                    AuthStorage.saveUserCache();

                    // set ib data from whois
                    BoardData.set(ss.group);
                    // cache ib data
                    BoardData.saveIbData();

                    return;
                }

            }, function() {
                // purge session if theres an error
                AuthStorage.destroySession();
                return;
            });
        },
        // log out the user
        logOut: function() {
            UserHandlers.logout.save();
            AuthStorage.destroySession();
            $route.reload();
            toaster.pop('success', user_messages.loggedOut);
        }
    };

    return AuthSession;

});
