// provides numerous functions for the auth system
angular.module('prim').factory('AuthService', function($rootScope, GlobalStore, LocalStore, jwtHelper, UserHandlers, Utils) {

    // holds default ib data
    var defaultIbData = {
        group: 1
    };

    // holds a default auth state
    var defaultAuthState = {
        id: 1,
        name: 'Anonymous',
        isAuthenticated: false,
        ibdata: defaultIbData
    };

    // user jwt token store key
    var tokenstorename = 'token';
    // user data cache store key
    var cachestorename = 'cache';
    // our ibdata store key
    var ibstorename = 'data';

    return {
        // show mod controls if user is mod or admin
        showModControls: function() {
            if ($rootScope.authState.isAuthenticated) {
                switch ($rootScope.authState.ibdata.group) {
                    case 3:
                        return true;
                    case 4:
                        return true;
                    default:
                        return false;
                }
            }
            return false;
        },
        // promise to the whoami handler
        queryWhoAmI: function() {
            return UserHandlers.whoami.get();
        },
        // set the state to the cached data if available
        setCachedState: function() {
            var self = this;

            // get the cached data if it exists
            var cachedAuthState = self.getUserCache();
            var cachedIbState = self.getIbData();

            // set our state to the cached version, or default if it isnt there
            if (cachedAuthState && cachedIbState) {
                $rootScope.authState = cachedAuthState;
                $rootScope.authState.ibdata = cachedIbState;
            } else {
                $rootScope.authState = defaultAuthState;
            }
        },
        // handles the creation of key and cache store and also queries whoami handler for fresh info
        setAuthState: function() {
            var self = this;

            // try and set the cached state first 
            self.setCachedState();

            // get the jwt token
            var token = self.getToken();

            // get a refreshed whois if there is a token
            if (token) {
                // if expired reset and delete
                if (jwtHelper.isTokenExpired(token)) {
                    self.destroySession();
                    return;
                }

                // query whoami for user data
                self.queryWhoAmI().$promise.then(function(data) {
                    // set the authstate to the whoami data
                    $rootScope.authState = {
                        id: data.user.id,
                        name: data.user.name,
                        isAuthenticated: true,
                        avatar: Utils.getAvatar(data.user.avatar)
                    };

                    // cache user data
                    self.saveUserCache($rootScope.authState);

                    // set our per ib data
                    $rootScope.authState.ibdata = {
                        group: data.user.group
                    };

                    // cache ib data
                    self.saveIbData($rootScope.authState.ibdata);

                    return;

                }, function() {
                    // purge session if theres an error
                    self.destroySession();
                    return;
                });

            }
        },
        // sets authstate to anon and removed all cached info
        destroySession: function() {
            localStorage.clear();
            // explicitly remove jwt token or else it will be cached
            GlobalStore.remove(tokenstorename);
            // set the state back to default
            $rootScope.authState = defaultAuthState;
        },
        // saves the user cache
        saveIbData: function(data) {
            LocalStore.set(ibstorename, data);
        },
        // gets the user cache
        getIbData: function() {
            return LocalStore.get(ibstorename);
        },
        // saves the user cache
        saveUserCache: function(cache) {
            GlobalStore.set(cachestorename, cache);
        },
        // gets the user cache
        getUserCache: function() {
            return GlobalStore.get(cachestorename);
        },
        // saves the jwt token
        saveToken: function(token) {
            GlobalStore.set(tokenstorename, token);
        },
        // retrieves the jwt token
        getToken: function() {
            var self = this;
            var token = GlobalStore.get(tokenstorename);
            if (token) {
                // if the token is expired remove it
                if (jwtHelper.isTokenExpired(token)) {
                    // reset the auth state
                    self.destroySession();
                    return null;
                }
                return token;
            }
            return null;
        }
    };
});
