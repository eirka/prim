// functions to help control the root scopes auth state
angular.module('prim').factory('AuthState', function($rootScope) {
    // default sessionless username
    var defaultName = "Anonymous";

    var AuthState = {
        // create a new authstate object
        new: function(id, name, auth, avatar, last) {
            return {
                id: id,
                name: name,
                isAuthenticated: auth,
                avatar: avatar,
                lastactive: last
            };
        },
        // return the default settings
        default: function() {
            return AuthState.set(1, defaultName, false, null, new Date());
        },
        // set rootscope authstate with new parameters
        set: function(id, name, auth, avatar, last) {
            $rootScope.authState = AuthState.new(id, name, auth, avatar, last);
        },
        // get current authstate object
        get: function() {
            return $rootScope.authState;
        },
        // reset back to default
        reset: function() {
            $rootScope.authState = AuthState.default();
        }
    };

    return AuthState;

});
