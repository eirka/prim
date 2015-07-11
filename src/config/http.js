angular.module('prim').config(function($httpProvider, jwtInterceptorProvider) {
    // we want all the credentials
    $httpProvider.defaults.withCredentials = true;
    // apply http requests 
    $httpProvider.useApplyAsync(true);

    // get the jwt token from storage if its there
    jwtInterceptorProvider.tokenGetter = ['AuthService', 'jwtHelper', function(AuthService, jwtHelper) {
        // get the token from storage
        var idToken = AuthService.getToken();

        if (idToken) {
            // if the token is expired remove it
            if (jwtHelper.isTokenExpired(idToken)) {
                // reset the auth state
                AuthService.destroySession();
                return null;
            };

            return idToken;
        };

        return null;
    }];

    // add jwtinterceptor to httpprovider interceptors
    $httpProvider.interceptors.push('jwtInterceptor');

});
