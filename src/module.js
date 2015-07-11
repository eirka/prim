require('angular');
require('angular-resource');
require('angular-cookies');
require('angular-route');
require('angular-sanitize');
require('angular-hotkeys');
require('angular-storage');
require('angular-jwt');

// our dependencies 
angular.module('prim', [
    'ui.bootstrap',
    'ngSanitize',
    'ngCookies',
    'ngRoute',
    'ngResource',
    'cfp.hotkeys',
    'angular-storage',
    'angular-jwt'
]);
