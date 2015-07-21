angular.module('prim').service('FavoritesHandler', function($resource, config) {
    return $resource(config.api_srv + '/get/user/favorites/:page', {
        page: '@page'
    }, {
        get: {
            method: 'GET'
        }
    });
});
