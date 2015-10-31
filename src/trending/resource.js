angular.module('prim').service('PopularHandler', function($resource, config) {
    return $resource(config.api_srv + '/get/popular/:ib', {
        ib: config.ib_id
    }, {
        get: {
            method: 'GET'
        }
    });
});

angular.module('prim').service('NewHandler', function($resource, config) {
    return $resource(config.api_srv + '/get/new/:ib', {
        ib: config.ib_id
    }, {
        get: {
            method: 'GET'
        }
    });
});

angular.module('prim').service('FavoritedHandler', function($resource, config) {
    return $resource(config.api_srv + '/get/favorited/:ib', {
        ib: config.ib_id
    }, {
        get: {
            method: 'GET'
        }
    });
});
