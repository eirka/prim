angular.module('prim').config(function($routeProvider, $locationProvider, $compileProvider) {
    $routeProvider
        .when('/', {
            title: 'Index',
            templateUrl: 'pages/main.html',
            controller: 'IndexCtrl',
            controllerAs: 'index'
        })
        .when('/page/:page', {
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
        .when('/tags/:page', {
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
        .when('/favorites', {
            title: 'Favorites',
            templateUrl: 'pages/favorites.html',
            controller: 'FavoritesCtrl',
            controllerAs: 'favorites'
        })
        .when('/favorites/:page', {
            title: 'Favorites',
            templateUrl: 'pages/favorites.html',
            controller: 'FavoritesCtrl',
            controllerAs: 'favorites'
        })
        .when('/trending', {
            title: 'Trending',
            templateUrl: 'pages/trending.html'
        })
        .when('/account', {
            title: 'Account',
            templateUrl: 'pages/account.html'
        })
        .when('/error', {
            templateUrl: 'pages/error.html',
            controller: 'errorHandler',
            controllerAs: 'error'
        })
        .otherwise({
            redirectTo: '/error'
        });

    $compileProvider.debugInfoEnabled(false);
    $locationProvider.html5Mode(true);
});


