angular.module('prim').service('Post', function($resource, config) {
    return $resource(config.api_srv + '/get/post/:ib/:thread/:id', {
        ib: config.ib_id,
        thread: '@thread',
        id: '@id'
    }, {
        get: {
            method: 'GET',
            cache: true
        }
    });
});
