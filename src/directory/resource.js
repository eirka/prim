angular.module('prim').service('Directory', function($resource, config) {
    return $resource(config.api_srv + '/get/directory/:ib', {
        ib: config.ib_id
    }, {
        get: {
            method: 'GET'
        }
    });
});
