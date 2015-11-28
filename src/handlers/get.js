// handlers for main routes
angular.module('prim').factory('Handlers', function($resource, config) {
    return {
        // index page
        'index': $resource(config.api_srv + '/get/index/:ib/:page', {
            ib: config.ib_id,
            page: '@page'
        }),
        // directory page
        'directory': $resource(config.api_srv + '/get/directory/:ib', {
            ib: config.ib_id
        }),
        // threads
        'thread': $resource(config.api_srv + '/get/thread/:ib/:id/:page', {
            ib: config.ib_id,
            id: '@id',
            page: '@page'
        }),
        // posts for hoverbox
        'post': $resource(config.api_srv + '/get/post/:ib/:thread/:id', {
            ib: config.ib_id,
            thread: '@thread',
            id: '@id'
        }, {
            get: {
                cache: true
            }
        }),
        // images
        'image': $resource(config.api_srv + '/get/image/:ib/:id', {
            ib: config.ib_id,
            id: '@id'
        }),
        // trending
        'popular': $resource(config.api_srv + '/get/popular/:ib', {
            ib: config.ib_id
        }),
        // trending
        'new': $resource(config.api_srv + '/get/new/:ib', {
            ib: config.ib_id
        }),
        // trending
        'favorited': $resource(config.api_srv + '/get/favorited/:ib', {
            ib: config.ib_id
        }),
        // tag directory
        'tags': $resource(config.api_srv + '/get/tags/:ib/:page', {
            ib: config.ib_id,
            page: '@page'
        }),
        // tag page
        'tag': $resource(config.api_srv + '/get/tag/:ib/:id/:page', {
            ib: config.ib_id,
            id: '@id',
            page: '@page'
        }),
        // tagtypes
        'tagtypes': $resource(config.api_srv + '/get/tagtypes', {}, {
            get: {
                cache: true
            }
        }),
        // tag search
        'tagsearch': $resource(config.api_srv + '/get/tagsearch/:ib', {
            ib: config.ib_id
        }),
        // add tag 
        'addtag': $resource(config.api_srv + '/post/tag/add', {}),
        // new tag
        'newtag': $resource(config.api_srv + '/post/tag/new', {})
    };
});
