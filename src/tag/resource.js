angular.module('prim').service('TagHandler', function($resource, config) {
    return $resource(config.api_srv + '/get/tag/:ib/:id/:page', {
        ib: config.ib_id,
        id: '@id',
        page: '@page'
    }, {
        get: {
            skipAuthorization: true,
            method: 'GET'
        }
    });
});
