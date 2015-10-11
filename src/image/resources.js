// gets the image from the api
angular.module('prim').service('ImageHandler', function($resource, config) {
    return $resource(config.api_srv + '/get/image/:ib/:id', {
        ib: config.ib_id,
        id: '@id'
    }, {
        get: {
            method: 'GET'
        }
    });
});

// adds a tag to an image
angular.module('prim').service('ImageAddTag', function($resource, config) {
    return $resource(config.api_srv + '/post/tag/add', {}, {
        save: {
            method: 'POST'
        }
    });
});

// adds a favorite
angular.module('prim').service('ImageAddFavorite', function($resource, config) {
    return $resource(config.api_srv + '/post/user/favorite', {}, {
        save: {
            method: 'POST'
        }
    });
});

// checks to see if an image has been starred
angular.module('prim').service('ImageGetFavorite', function($resource, config) {
    return $resource(config.api_srv + '/get/user/favorite/:id', {
        id: '@id'
    }, {
        get: {
            method: 'GET'
        }
    });
});

// deletes an image tag
angular.module('prim').service('ImageTagDeleteHandler', function($resource, config) {
    return $resource(config.api_srv + '/post/mod/imagetag/:image/:tag', {
        image: '@image',
        tag: '@tag'
    });
});
