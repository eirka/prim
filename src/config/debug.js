angular.module('prim').config(function($compileProvider) {
    // controls debug info, needs to be true to use ng-inspector
    $compileProvider.debugInfoEnabled(false);
});
