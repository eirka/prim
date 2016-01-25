// configures the http provider
angular.module('prim').config(function($httpProvider, $locationProvider, jwtInterceptorProvider) {

    // turns on html5 pushstate mode
    $locationProvider.html5Mode(true);

    // we want all the credentials
    $httpProvider.defaults.withCredentials = true;
    // async http requests 
    $httpProvider.useApplyAsync(true);

    // get the jwt token from storage if its there and add authentication header
    jwtInterceptorProvider.tokenGetter = ['AuthService', function(AuthService) {
        // get the token from storage
        return AuthService.getToken();
    }];

    // add jwtinterceptor to httpprovider interceptors
    $httpProvider.interceptors.push('jwtInterceptor');

    // add our error interceptor
    $httpProvider.interceptors.push('errorInterceptor');

});

// error interceptor
angular.module('prim').factory('errorInterceptor', function($q, $location, toaster, Utils) {
    return {
        'responseError': function(rejection) {
            if (angular.equals(rejection.status, -1)) {
                // if there is a weird error the app probably cant contact the api server
                Utils.apiError(502);
            } else if (angular.equals(rejection.status, 401) || angular.equals(rejection.status, 403)) {
                // if unauthorized or forbidden forward to the login page
                toaster.pop('error', rejection.data.error_message);
                $location.path('/account');
            }
            return $q.reject(rejection);
        }
    };
});
