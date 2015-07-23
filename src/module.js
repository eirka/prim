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
    'toaster'
]);
