require('angular');
require('angular-resource');
require('angular-route');
require('angular-sanitize');
require('angular-hotkeys');

angular.module('prim', ['ui.bootstrap', 'ngSanitize', 'ngRoute', 'ngResource', 'cfp.hotkeys']);
