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
