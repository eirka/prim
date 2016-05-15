// configures the http provider
angular.module('prim').config(function($httpProvider, $locationProvider) {

    // turns on html5 pushstate mode
    $locationProvider.html5Mode(true);

    // we want all the credentials
    $httpProvider.defaults.withCredentials = true;
    // async http requests
    $httpProvider.useApplyAsync(true);

    // add our error interceptor
    $httpProvider.interceptors.push('errorInterceptor');

});
