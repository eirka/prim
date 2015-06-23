angular.module('prim').config(function($routeProvider, $locationProvider, $compileProvider, $httpProvider) {
    $routeProvider
        .when('/', {
            title: 'Index',
            templateUrl: 'pages/main.html',
            controller: 'IndexCtrl',
            controllerAs: 'index'
        })
        .when('/page/:id', {
            title: 'Index',
            templateUrl: 'pages/main.html',
            controller: 'IndexCtrl',
            controllerAs: 'index'
        })
        .when('/thread/:id/:page', {
            templateUrl: 'pages/thread.html',
            controller: 'ThreadCtrl',
            controllerAs: 'thread'
        })
        .when('/directory', {
            title: 'Threads',
            templateUrl: 'pages/directory.html',
            controller: 'DirectoryCtrl',
            controllerAs: 'directory'
        })
        .when('/image/:id', {
            templateUrl: 'pages/image.html',
            controller: 'ImageCtrl',
            controllerAs: 'image'
        })
        .when('/tags', {
            title: 'Tags',
            templateUrl: 'pages/tags.html',
            controller: 'TagsCtrl',
            controllerAs: 'tags'
        })
        .when('/tag/:id/:page', {
            templateUrl: 'pages/tag.html',
            controller: 'TagCtrl',
            controllerAs: 'tag'
        })
        .when('/error', {
            templateUrl: 'pages/error.html',
            controller: 'errorHandler'
        })
        .otherwise({
            redirectTo: '/error'
        });

    $compileProvider.debugInfoEnabled(false);
    $locationProvider.html5Mode(true);
    $httpProvider.defaults.withCredentials = true;
});
