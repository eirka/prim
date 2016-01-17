angular.module('prim').config(function($routeProvider, $locationProvider, $compileProvider) {
    $routeProvider
        .when('/', {
            title: 'Index',
            templateUrl: 'pages/main.html',
            controller: 'IndexCtrl',
            controllerAs: 'index',
            resolve: {
                data: function($route, Handlers, Utils) {
                    return Handlers.index.get({
                        page: 1
                    }).$promise.then(function(data) {
                        return data;
                    }, function(error) {
                        Utils.apiError(error.status);
                    });
                }
            }
        })
        .when('/page/:page', {
            title: 'Index',
            templateUrl: 'pages/main.html',
            controller: 'IndexCtrl',
            controllerAs: 'index',
            resolve: {
                data: function($route, Handlers, Utils) {
                    return Handlers.index.get({
                        page: $route.current.params.page
                    }).$promise.then(function(data) {
                        return data;
                    }, function(error) {
                        Utils.apiError(error.status);
                    });
                }
            }
        })
        .when('/thread/:id/:page', {
            templateUrl: 'pages/thread.html',
            controller: 'ThreadCtrl',
            controllerAs: 'thread',
            resolve: {
                data: function($route, Handlers, Utils) {
                    return Handlers.thread.get({
                        id: $route.current.params.id,
                        page: $route.current.params.page
                    }).$promise.then(function(data) {
                        return data;
                    }, function(error) {
                        Utils.apiError(error.status);
                    });
                }
            }
        })
        .when('/directory', {
            title: 'Threads',
            templateUrl: 'pages/directory.html',
            controller: 'DirectoryCtrl',
            controllerAs: 'directory',
            resolve: {
                data: function($route, Handlers, Utils) {
                    return Handlers.directory.get().$promise.then(function(data) {
                        return data;
                    }, function(error) {
                        Utils.apiError(error.status);
                    });
                }
            }
        })
        .when('/image/:id', {
            templateUrl: 'pages/image.html',
            controller: 'ImageCtrl',
            controllerAs: 'image',
            resolve: {
                data: function($route, Handlers, Utils) {
                    return Handlers.image.get({
                        id: $route.current.params.id
                    }).$promise.then(function(data) {
                        return data;
                    }, function(error) {
                        Utils.apiError(error.status);
                    });
                }
            }
        })
        .when('/tags', {
            title: 'Tags',
            templateUrl: 'pages/tags.html',
            controller: 'TagsCtrl',
            controllerAs: 'tags',
            resolve: {
                data: function($route, Handlers, Utils) {
                    return Handlers.tags.get({
                        page: 1
                    }).$promise.then(function(data) {
                        return data;
                    }, function(error) {
                        Utils.apiError(error.status);
                    });
                }
            }
        })
        .when('/tags/:page', {
            title: 'Tags',
            templateUrl: 'pages/tags.html',
            controller: 'TagsCtrl',
            controllerAs: 'tags',
            resolve: {
                data: function($route, Handlers, Utils) {
                    return Handlers.tags.get({
                        page: $route.current.params.page
                    }).$promise.then(function(data) {
                        return data;
                    }, function(error) {
                        Utils.apiError(error.status);
                    });
                }
            }
        })
        .when('/tag/:id/:page', {
            templateUrl: 'pages/tag.html',
            controller: 'TagCtrl',
            controllerAs: 'tag',
            resolve: {
                data: function($route, Handlers, Utils) {
                    return Handlers.tag.get({
                        id: $route.current.params.id,
                        page: $route.current.params.page
                    }).$promise.then(function(data) {
                        return data;
                    }, function(error) {
                        Utils.apiError(error.status);
                    });
                }
            }
        })
        .when('/trending', {
            title: 'Trending',
            controller: 'TrendingCtrl',
            controllerAs: 'trending',
            templateUrl: 'pages/trending.html',
            resolve: {
                popular: function(Handlers, Utils) {
                    return Handlers.popular.get().$promise.then(function(data) {
                        return data;
                    }, function(error) {
                        Utils.apiError(error.status);
                    });
                },
                newest: function(Handlers, Utils) {
                    return Handlers.newest.get().$promise.then(function(data) {
                        return data;
                    }, function(error) {
                        Utils.apiError(error.status);
                    });
                },
                favorited: function(Handlers, Utils) {
                    return Handlers.favorited.get().$promise.then(function(data) {
                        return data;
                    }, function(error) {
                        Utils.apiError(error.status);
                    });
                },
            }
        })
        .when('/favorites', {
            title: 'Favorites',
            templateUrl: 'pages/favorites.html',
            controller: 'FavoritesCtrl',
            controllerAs: 'favorites',
            resolve: {
                data: function($route, UserHandlers, Utils) {
                    return UserHandlers.favorites.get({
                        page: 1
                    }).$promise.then(function(data) {
                        return data;
                    }, function(error) {
                        Utils.apiError(error.status);
                    });
                }
            }
        })
        .when('/favorites/:page', {
            title: 'Favorites',
            templateUrl: 'pages/favorites.html',
            controller: 'FavoritesCtrl',
            controllerAs: 'favorites',
            resolve: {
                data: function($route, UserHandlers, Utils) {
                    return UserHandlers.favorites.get({
                        page: $route.current.params.page
                    }).$promise.then(function(data) {
                        return data;
                    }, function(error) {
                        Utils.apiError(error.status);
                    });
                }
            }
        })
        .when('/account', {
            title: 'Account',
            templateUrl: 'pages/account.html'
        })
        .when('/admin', {
            title: 'Admin Panel',
            templateUrl: 'pages/admin.html',
            controller: 'AdminCtrl',
            controllerAs: 'admin'
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
