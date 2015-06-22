angular.module('prim').service('Tag', function($resource, config) {
    return $resource(config.api_srv + '/get/tag/:ib/:id/:page', {
        ib: config.ib_id,
        id: '@id',
        page: '@page'
    }, {
        get: {
            method: 'GET'
        }
    });
});

angular.module('prim').service('NewTag', function($resource, config) {
    return $resource(config.api_srv + '/post/tag/new', {}, {
        save: {
            method: 'POST'
        }
    });
});
