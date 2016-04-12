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

// error interceptor
angular.module('prim').factory('errorInterceptor', function($q, $location, toaster, user_messages, Utils, AuthStorage) {
    return {
        'responseError': function(rejection) {
            if (angular.equals(rejection.status, 401)) {
                // the JWT session is bad so reset state and ask user to re-login
                AuthStorage.destroySession();
                $location.path('/account');
                toaster.pop('info', user_messages.reAuth);
                return;
            } else if (angular.equals(rejection.status, 403)) {
                // if forbidden forward to the login page
                $location.path('/account');
                toaster.pop('error', rejection.data.error_message);
                return;
            } else if (angular.equals(rejection.status, -1)) {
                // if there is a weird error the app probably cant contact the api server
                Utils.apiError(502);
            }
            return $q.reject(rejection);
        }
    };
});
