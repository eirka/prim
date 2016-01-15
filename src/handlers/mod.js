// handlers for mod and admin functions
angular.module('prim').factory('ModHandlers', function($resource, config) {
    return {
        // board statistics
        'statistics': $resource(config.api_srv + '/admin/statistics/:ib', {
            ib: config.ib_id
        }),
        // delete a thread
        'deletethread': $resource(config.api_srv + '/admin/thread/:id', {
            id: '@id'
        }),
        // delete a post
        'deletepost': $resource(config.api_srv + '/admin/post/:thread/:id', {
            thread: '@thread',
            id: '@id'
        }),
        // delete a tag
        'deletetag': $resource(config.api_srv + '/admin/tag/:id', {
            id: '@id'
        }),
        // open/close a thread
        'close': $resource(config.api_srv + '/admin/close/:id', {
            id: '@id'
        }),
        // sticky/unsticky a thread
        'sticky': $resource(config.api_srv + '/admin/sticky/:id', {
            id: '@id'
        }),
        // delete a tag that is attached to an image
        'deleteimagetag': $resource(config.api_srv + '/admin/imagetag/:image/:tag', {
            image: '@image',
            tag: '@tag'
        }),
        // login
        'updatetag': $resource(config.api_srv + '/admin/tag', {}),
    };
});
