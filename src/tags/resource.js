// return the list of tags for the imageboard
angular.module('prim').service('TagsHandler', function($resource, config) {
    return $resource(config.api_srv + '/get/tags/:ib', {
        ib: config.ib_id
    }, {
        get: {
            skipAuthorization: true,
            method: 'GET'
        }
    });
});

// get a list of the tag types
angular.module('prim').service('TagTypesHandler', function($resource, config) {
    return $resource(config.api_srv + '/get/tagtypes', {}, {
        get: {
            skipAuthorization: true,
            method: 'GET',
            cache: true
        }
    });
});

// add a new tag to ib
angular.module('prim').service('TagsNewTag', function($resource, config) {
    return $resource(config.api_srv + '/post/tag/new', {}, {
        save: {
            method: 'POST'
        }
    });
});
