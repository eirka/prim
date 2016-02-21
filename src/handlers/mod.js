// handlers for mod and admin functions
angular.module('prim').factory('ModHandlers', function($resource, config) {
    return {
        // board statistics
        'statistics': $resource(config.api_srv + '/admin/statistics/:ib', {
            ib: config.ib_id
        }),
        // board audit log
        'boardlog': $resource(config.api_srv + '/admin/log/board/:ib/:page', {
            ib: config.ib_id,
            page: '@page'
        }),
        // mod audit log
        'modlog': $resource(config.api_srv + '/admin/log/mod/:ib/:page', {
            ib: config.ib_id,
            page: '@page'
        }),
        // delete a thread
        'deletethread': $resource(config.api_srv + '/admin/thread/:ib/:id', {
            ib: config.ib_id,
            id: '@id'
        }),
        // delete a post
        'deletepost': $resource(config.api_srv + '/admin/post/:ib/:thread/:id', {
            ib: config.ib_id,
            thread: '@thread',
            id: '@id'
        }),
        // delete a tag
        'deletetag': $resource(config.api_srv + '/admin/tag/:ib/:id', {
            ib: config.ib_id,
            id: '@id'
        }),
        // open/close a thread
        'close': $resource(config.api_srv + '/admin/close/:ib/:id', {
            ib: config.ib_id,
            id: '@id'
        }),
        // sticky/unsticky a thread
        'sticky': $resource(config.api_srv + '/admin/sticky/:ib/:id', {
            ib: config.ib_id,
            id: '@id'
        }),
        // delete a tag that is attached to an image
        'deleteimagetag': $resource(config.api_srv + '/admin/imagetag/:ib/:image/:tag', {
            ib: config.ib_id,
            image: '@image',
            tag: '@tag'
        }),
        // update a tags info
        'updatetag': $resource(config.api_srv + '/admin/tag/:ib', {
            ib: config.ib_id
        }),
        // ban an ip
        'banip': $resource(config.api_srv + '/admin/ban/ip/:ib/:thread/:id', {
            ib: config.ib_id,
            thread: '@thread',
            id: '@id'
        }),
        // ban an image file hash
        'banfile': $resource(config.api_srv + '/admin/ban/file/:ib/:thread/:id', {
            ib: config.ib_id,
            thread: '@thread',
            id: '@id'
        }),
    };
});
