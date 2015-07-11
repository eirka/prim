angular.module('prim').service('DirectoryHandler', function($resource, config) {
    return $resource(config.api_srv + '/get/directory/:ib', {
        ib: config.ib_id
    }, {
        get: {
            skipAuthorization: true,
            method: 'GET'
        }
    });
});
