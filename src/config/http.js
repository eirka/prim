// configures the http provider
angular.module('prim').config(function($httpProvider, $locationProvider, jwtInterceptorProvider) {

    // turns on html5 pushstate mode
    $locationProvider.html5Mode(true);

    // we want all the credentials
    $httpProvider.defaults.withCredentials = true;
    // async http requests
    $httpProvider.useApplyAsync(true);

    // get the jwt token from storage if its there and add authentication header
    jwtInterceptorProvider.tokenGetter = ['AuthStorage', function(AuthStorage) {
        // get the token from storage
        return AuthStorage.getToken();
    }];

    // add jwtinterceptor to httpprovider interceptors
    $httpProvider.interceptors.push('jwtInterceptor');

    // add our error interceptor
    $httpProvider.interceptors.push('errorInterceptor');

});
