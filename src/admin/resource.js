angular.module('prim').service('ThreadDeleteHandler', function($resource, config) {
    return $resource(config.api_srv + '/admin/thread/:id', {
        id: '@id'
    });
});

angular.module('prim').service('PostDeleteHandler', function($resource, config) {
    return $resource(config.api_srv + '/admin/post/:thread/:id', {
        thread: '@thread',
        id: '@id'
    });
});

angular.module('prim').service('CloseThreadHandler', function($resource, config) {
    return $resource(config.api_srv + '/admin/close/:id', {
        id: '@id'
    });
});

angular.module('prim').service('StickyThreadHandler', function($resource, config) {
    return $resource(config.api_srv + '/admin/sticky/:id', {
        id: '@id'
    });
});

angular.module('prim').service('TagDeleteHandler', function($resource, config) {
    return $resource(config.api_srv + '/admin/tag/:id', {
        id: '@id'
    });
});

angular.module('prim').service('ImageTagDeleteHandler', function($resource, config) {
    return $resource(config.api_srv + '/admin/imagetag/:image/:tag', {
        image: '@image',
        tag: '@tag'
    });
});
