angular.module('prim').service('IndexHandler', function($resource, config) {
    return $resource(config.api_srv + '/get/index/:ib/:page', {
        ib: config.ib_id,
        page: '@page'
    }, {
        get: {
            method: 'GET'
        }
    });
});
