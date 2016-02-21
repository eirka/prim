// provides numerous functions for the auth system
angular.module('prim').factory('AuthService', function($rootScope, $route, toaster, user_messages, GlobalStore, LocalStore, jwtHelper, UserHandlers, Utils) {

    // holds default ib data
    var defaultIbData = {
        group: 1
    };

    // holds a default auth state
    var defaultAuthState = {
        id: 1,
        name: 'Anonymous',
        isAuthenticated: false,
        avatar: null,
        ibdata: defaultIbData
    };

    // user jwt token store key
    var tokenstorename = 'token';
    // user data cache store key
    var cachestorename = 'cache';
    // our ibdata store key
    var ibstorename = 'data';

    var AuthService = {
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
            // get the cached data if it exists
            var cachedAuthState = AuthService.getUserCache();
            var cachedIbState = AuthService.getIbData();

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
            // try and set the cached state first
            AuthService.setCachedState();

            // get the jwt token
            var token = AuthService.getToken();

            // get a refreshed whois if there is a token
            if (token) {
                // query whoami for user data
                AuthService.queryWhoAmI().$promise.then(function(data) {

                    // set the authstate to the whoami data
                    $rootScope.authState = {
                        id: data.user.id,
                        name: data.user.name,
                        isAuthenticated: true,
                        avatar: Utils.getAvatar(data.user.id),
                        lastactive: new Date(data.user.last_active)
                    };

                    // cache user data
                    AuthService.saveUserCache($rootScope.authState);

                    // set our per ib data
                    $rootScope.authState.ibdata = {
                        group: data.user.group
                    };

                    // cache ib data
                    AuthService.saveIbData($rootScope.authState.ibdata);

                    return;

                }, function() {
                    // purge session if theres an error
                    AuthService.destroySession();
                    return;
                });

            }
        },
        // gets the users last active date
        getLastActive: function(date) {
            if (angular.isDefined(date)) {
                date = new Date(date);
                if (angular.isDate(date)) {
                    return $rootScope.authState.lastactive < date;
                }
                return false;
            }
            return false;
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
            if (angular.isDefined(data)) {
                LocalStore.set(ibstorename, data);
            }
        },
        // gets the user cache
        getIbData: function() {
            return LocalStore.get(ibstorename);
        },
        // saves the user cache
        saveUserCache: function(cache) {
            if (angular.isDefined(cache)) {
                GlobalStore.set(cachestorename, cache);
            }
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
                // if the token is expired remove it
                if (jwtHelper.isTokenExpired(token)) {
                    // reset the auth state
                    AuthService.destroySession();
                    return null;
                }
                return token;
            }
            return null;
        },
        // log out the user
        logOut: function() {
            AuthService.destroySession();
            $route.reload();
            toaster.pop('success', user_messages.loggedOut);
        }
    };

    return AuthService;

});
