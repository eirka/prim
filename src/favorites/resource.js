angular.module('prim').service('FavoritesHandler', function($resource, config) {
    return $resource(config.api_srv + '/get/user/favorites/:ib/:page', {
        ib: config.ib_id,
        page: '@page'
    }, {
        get: {
            method: 'GET'
        }
    });
});
