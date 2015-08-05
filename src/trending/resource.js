angular.module('prim').service('PopularHandler', function($resource, config) {
    return $resource(config.api_srv + '/get/popular/:ib', {
        ib: config.ib_id
    }, {
        get: {
            method: 'GET'
        }
    });
});
