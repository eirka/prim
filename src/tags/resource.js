angular.module('prim').service('TagList', function($resource, config) {
    return $resource(config.api_srv + '/get/tags/:ib', {
        ib: config.ib_id
    }, {
        get: {
            method: 'GET'
        }
    });
});

angular.module('prim').service('TagTypes', function($resource, config) {
    return $resource(config.api_srv + '/get/tagtypes', {}, {
        get: {
            method: 'GET',
            cache: true
        }
    });
});
