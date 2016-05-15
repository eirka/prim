// functions for handling the auth storage in users browser
angular.module('prim').factory('AuthStorage', function(GlobalStore, AuthState, BoardData) {

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
        // sets authstate to anon and removed all cached info
        destroySession: function() {
            // clear all localstorage. this also deletes drawpad sketches
            localStorage.clear();
            // set the state back to default
            AuthState.default();
            // set board data back to default
            BoardData.default();
        }
    };

    return AuthStorage;

});
