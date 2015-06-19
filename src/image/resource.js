angular.module('prim').service('Image', function($resource, config) {
    return $resource(config.api_srv + '/get/image/:ib/:id', {
        ib: config.ib_id,
        id: '@id'
    }, {
        get: {
            method: 'GET'
        }
    });
});
