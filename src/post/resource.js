angular.module('prim').service('PostHandler', function($resource, config) {
    return $resource(config.api_srv + '/get/post/:ib/:thread/:id', {
        ib: config.ib_id,
        thread: '@thread',
        id: '@id'
    }, {
        get: {
            skipAuthorization: true,
            method: 'GET',
            cache: true
        }
    });
});
