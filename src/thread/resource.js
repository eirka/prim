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
