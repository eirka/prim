// return the list of tags for the imageboard
angular.module('prim').service('TagsHandler', function($resource, config) {
    return $resource(config.api_srv + '/get/tags/:ib/:page', {
        ib: config.ib_id,
        page: '@page'
    });
});

// get a list of the tag types
angular.module('prim').service('TagTypesHandler', function($resource, config) {
    return $resource(config.api_srv + '/get/tagtypes', {}, {
        get: {
            cache: true
        }
    });
});

// add a new tag to ib
angular.module('prim').service('TagsNewTag', function($resource, config) {
    return $resource(config.api_srv + '/post/tag/new', {}, {});
});

// searches tags with a query
angular.module('prim').service('TagSearchHandler', function($resource, config) {
    return $resource(config.api_srv + '/get/tagsearch/:ib', {
        ib: config.ib_id
    });
});

