angular.module('prim').service('ThreadHandler', function($resource, config) {
    return $resource(config.api_srv + '/get/thread/:ib/:id/:page', {
        ib: config.ib_id,
        id: '@id',
        page: '@page'
    }, {
        get: {
            method: 'GET'
        }
    });
});

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
