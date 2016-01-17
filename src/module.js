// require for browserify
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
require('angular-chart.js');

// add the dependencies to our module
angular.module('prim', [
    'ui.bootstrap',
    'ngResource',
    'ngCookies',
    'ngRoute',
    'ngSanitize',
    'cfp.hotkeys',
    'angular-storage',
    'angular-jwt',
    'ngAnimate',
    'toaster',
    'angulartics',
    'angulartics.google.analytics',
    'chart.js'
]);
