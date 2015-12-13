require('angular');
require('angular-resource');
require('angular-cookies');
require('angular-route');
require('angular-sanitize');
require('angular-hotkeys');
require('angular-storage');
require('angular-jwt');
require('angular-animate');
require('angularjs-toaster');
require('angulartics');
require('angulartics-google-analytics');

// our dependencies 
angular.module('prim', [
    'ui.bootstrap',
    'ngSanitize',
    'ngAnimate',
    'ngCookies',
    'ngRoute',
    'ngResource',
    'cfp.hotkeys',
    'angular-storage',
    'angular-jwt',
    'toaster',
    'angulartics',
    'angulartics.google.analytics'
]);
