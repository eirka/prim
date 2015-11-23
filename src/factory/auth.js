angular.module('prim').factory('AuthService', function($rootScope, $route, store, jwtHelper, WhoAmIHandler, Utils) {

    // holds a default auth state
    var defaultAuthState = {
        id: 1,
        name: 'Anonymous',
        group: 1,
        isAuthenticated: false
    };

    return {
        queryWhoAmI: function() {
            return WhoAmIHandler.get();
        },
        setAuthState: function() {
            // get the cache if it exists
            cachedAuthState = store.get('id_cache');

            // set our state to the cached version, or default if it isnt there
            if (cachedAuthState) {
                $rootScope.authState = cachedAuthState;
            }

            // get the jwt token
            var token = store.get('id_token');

            if (token) {
                // if expired reset and delete
                if (jwtHelper.isTokenExpired(token)) {
                    this.destroySession();
                    return
                }

                // query whoami for user data
                this.queryWhoAmI().$promise.then(function(data) {

                    // set the authstate to the token data
                    $rootScope.authState = {
                        id: data.user.id,
                        name: data.user.name,
                        group: data.user.group,
                        avatar: Utils.getAvatar(data.user.avatar),
                        isAuthenticated: true
                    };

                    // cache data
                    store.set('id_cache', $rootScope.authState);

                    // reload route
                    //$route.reload();

                    return

                }, function(error) {
                    // purge session if theres an error
                    this.destroySession();
                    return
                });

            };

            // set initial state if theres no token
            $rootScope.authState = defaultAuthState;

        },
        destroySession: function() {
            $rootScope.authState = defaultAuthState;
            store.remove('id_token');
            store.remove('id_cache');
        },
        saveToken: function(token) {
            store.set('id_token', token);
        },
        getToken: function() {
            return store.get('id_token');
        }
    };
});
