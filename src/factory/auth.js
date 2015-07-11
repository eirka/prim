angular.module('prim').factory('AuthService', function($rootScope, store, jwtHelper, WhoAmIHandler) {

    // holds a default auth state
    var defaultAuthState = {
        id: 1,
        name: 'Anonymous',
        group: 1,
        isAuthenticated: false
    };

    // get the cache if it exists
    var cachedAuthState = store.get('id_cache');

    // set our state to the cached version, or default if it isnt there
    if (cachedAuthState) {
        $rootScope.authState = cachedAuthState;
    } else {
        $rootScope.authState = defaultAuthState;
    }

    return {
        setAuthState: function() {
            // get the jwt token
            var token = store.get('id_token');

            // if the token is there
            if (token) {

                // if expired reset and delete
                if (jwtHelper.isTokenExpired(token)) {
                    this.destroySession();
                }

                // query who am i
                WhoAmIHandler.get(function(data) {
                    // set the authstate to the token data
                    $rootScope.authState = {
                        id: data.user.id,
                        name: data.user.name,
                        group: data.user.group,
                        isAuthenticated: true
                    };

                    // cache data
                    store.set('id_cache', $rootScope.authState);

                }, function(error) {
                    this.destroySession();
                });

            };

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
