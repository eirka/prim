angular.module('prim').config(function($httpProvider, jwtInterceptorProvider) {

    // get the jwt token from storage if its there and add authentication header
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

    // we want all the credentials
    $httpProvider.defaults.withCredentials = true;
    // async http requests 
    $httpProvider.useApplyAsync(true);

});
