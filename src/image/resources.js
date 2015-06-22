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
