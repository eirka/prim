angular.module('prim').service('ThreadDeleteHandler', function($resource, config) {
    return $resource(config.api_srv + '/post/admin/thread/:id', {
        id: '@id'
    });
});

angular.module('prim').service('PostDeleteHandler', function($resource, config) {
    return $resource(config.api_srv + '/post/admin/post/:thread/:id', {
        thread: '@thread',
        id: '@id'
    });
});

angular.module('prim').service('CloseThreadHandler', function($resource, config) {
    return $resource(config.api_srv + '/post/mod/close/:id', {
        id: '@id'
    });
});

angular.module('prim').service('StickyThreadHandler', function($resource, config) {
    return $resource(config.api_srv + '/post/mod/sticky/:id', {
        id: '@id'
    });
});

angular.module('prim').service('TagDeleteHandler', function($resource, config) {
    return $resource(config.api_srv + '/post/mod/tag/:id', {
        id: '@id'
    });
});

angular.module('prim').service('ImageTagDeleteHandler', function($resource, config) {
    return $resource(config.api_srv + '/post/mod/imagetag/:image/:tag', {
        image: '@image',
        tag: '@tag'
    });
});
