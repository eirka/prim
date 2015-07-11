angular.module('prim').service('IndexHandler', function($resource, config) {
    return $resource(config.api_srv + '/get/index/:ib/:id', {
        ib: config.ib_id,
        id: '@id'
    }, {
        get: {
        	skipAuthorization: true,
            method: 'GET'
        }
    });
});
