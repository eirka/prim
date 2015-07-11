angular.module('prim').factory('AuthService', function($rootScope, store, jwtHelper, WhoAmIHandler) {

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

                // query who am i
                WhoAmIHandler.get(function(data) {
                    // set the authstate to the token data
                    $rootScope.authState = {
                        id: data.user.id,
                        name: data.user.name,
                        group: data.user.group,
                        isAuthenticated: true
                    };
                }, function(error) {
                    $rootScope.authState = defaultAuthState;
                    store.remove('id_token');
                });

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
