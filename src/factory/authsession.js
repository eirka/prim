// provides functions for setting the users auth session
angular.module('prim').factory('AuthSession', function($route, toaster, user_messages, jwtHelper, AuthStorage, AuthState, BoardData, UserHandlers, Utils) {

    var AuthSession = {
        // promise to the whoami handler
        queryWhoAmI: function() {
            return UserHandlers.whoami.get();
        },
        // set the state to the cached data if available
        setCachedState: function() {
            // get the cached user data
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
        },
        // handles the creation of key and cache store and also queries whoami handler for fresh info
        setAuthState: function() {
            // try and set the cached state first
            AuthSession.setCachedState();

            // get the jwt token
            var token = AuthStorage.getToken();

            // get a refreshed whois if there is a token
            if (token) {
                // query whoami for user data
                AuthSession.queryWhoAmI().$promise.then(function(data) {
                    var ss = data.user;

                    // set auth state from whois information
                    AuthState.set(ss.id, ss.name, true, Utils.getAvatar(ss.id), new Date(ss.last_active));
                    // cache user data
                    AuthStorage.saveUserCache();

                    // set ib data from whois
                    BoardData.set(ss.group);
                    // cache ib data
                    BoardData.saveIbData();

                    return;
                }, function() {
                    // purge session if theres an error
                    AuthStorage.destroySession();
                    return;
                });
            }
        },
        // log out the user
        logOut: function() {
            AuthStorage.destroySession();
            $route.reload();
            toaster.pop('success', user_messages.loggedOut);
        }
    };

    return AuthSession;

});

// functions for handling the auth storage in users browser
angular.module('prim').factory('AuthStorage', function(GlobalStore, jwtHelper, AuthState, BoardData) {

    // user jwt token store key
    var tokenstorename = 'token';
    // user data cache store key
    var cachestorename = 'cache';

    var AuthStorage = {
        // saves the user cache
        saveUserCache: function() {
            GlobalStore.set(cachestorename, AuthState.get());
        },
        // gets the user cache
        getUserCache: function() {
            return GlobalStore.get(cachestorename);
        },
        // saves the jwt token
        saveToken: function(token) {
            if (angular.isDefined(token)) {
                GlobalStore.set(tokenstorename, token);
            }
        },
        // retrieves the jwt token
        getToken: function() {
            var token = GlobalStore.get(tokenstorename);
            if (token) {
                try {
                    // check if token is expired
                    if (jwtHelper.isTokenExpired(token)) {
                        // log out if its expired
                        AuthStorage.destroySession();
                        return null;
                    } else {
                        // use the token otherwise
                        return token;
                    }
                } catch (error) {
                    // something is probably wrong with the token
                    AuthStorage.destroySession();
                }
            }
            return null;
        },
        // sets authstate to anon and removed all cached info
        destroySession: function() {
            // clear all localstorage. this also deletes drawpad sketches
            localStorage.clear();
            // explicitly remove jwt token or else it will be cached
            GlobalStore.remove(tokenstorename);
            // set the state back to default
            AuthState.default();
            // set board data back to default
            BoardData.default();
        }
    };

    return AuthStorage;

});
