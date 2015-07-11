angular.module('prim').factory('AuthService', function($rootScope, store, jwtHelper) {

    // holds a default auth state
    var defaultAuthState = {
        id: 1,
        name: 'Anonymous',
        group: 1,
        isAuthenticated: false
    };

    // set rootscope to default state
    $rootScope.authState = defaultAuthState;

    return {
        setAuthState: function() {
            // get the token
            var token = store.get('id_token');

            // if the token is there
            if (token) {

                // if expired reset and delete
                if (jwtHelper.isTokenExpired(token)) {
                    $rootScope.authState = defaultAuthState;
                    store.remove('id_token');
                }

                // decode token
                var data = jwtHelper.decodeToken(token);

                // set the authstate to the token data
                $rootScope.authState = {
                    id: data.user_id,
                    name: data.user_name,
                    group: data.user_group,
                    isAuthenticated: true
                };

            } else {
                // if there is no token reset the state
                $rootScope.authState = defaultAuthState;

            };

        },
        destroySession: function() {
            $rootScope.authState = defaultAuthState;
            store.remove('id_token');
        },
        saveToken: function(token) {
            store.set('id_token', token);
        },
        getToken: function() {
            return store.get('id_token');
        }
    };
});
