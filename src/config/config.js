angular.module('prim').config(function($routeProvider, $locationProvider, $compileProvider, $httpProvider) {
    $routeProvider
        .when('/', {
            title: 'Index',
            templateUrl: 'pages/main.html',
            controller: 'getIndex'
        })
        .when('/page/:id', {
            title: 'Index',
            templateUrl: 'pages/main.html',
            controller: 'getIndex'
        })
        .when('/thread/:id/:page', {
            templateUrl: 'pages/thread.html',
            controller: 'getThread'
        })
        .when('/post/:id/:post', {
            templateUrl: 'pages/post.html',
            controller: 'getPost'
        })
        .when('/directory', {
            title: 'Threads',
            templateUrl: 'pages/directory.html',
            controller: 'getDirectory'
        })
        .when('/image/:id', {
            templateUrl: 'pages/image.html',
            controller: 'ImageCtrl',
            controllerAs: 'image'
        })
        .when('/tags', {
            title: 'Tags',
            templateUrl: 'pages/tags.html',
            controller: 'getTagList'
        })
        .when('/tag/:id/:page', {
            templateUrl: 'pages/tag.html',
            controller: 'getTag'
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
