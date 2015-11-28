// handlers for main routes
angular.module('prim').factory('Handlers', function($resource, config) {
    return {
        'index': $resource(config.api_srv + '/get/index/:ib/:page', {
            ib: config.ib_id,
            page: '@page'
        }),
        'directory': $resource(config.api_srv + '/get/directory/:ib', {
            ib: config.ib_id
        }),
        'thread': $resource(config.api_srv + '/get/thread/:ib/:id/:page', {
            ib: config.ib_id,
            id: '@id',
            page: '@page'
        }),
        'image': $resource(config.api_srv + '/get/image/:ib/:id', {
            ib: config.ib_id,
            id: '@id'
        }),
        'popular': $resource(config.api_srv + '/get/popular/:ib', {
            ib: config.ib_id
        }),
        'new': $resource(config.api_srv + '/get/new/:ib', {
            ib: config.ib_id
        }),
        'favorited': $resource(config.api_srv + '/get/favorited/:ib', {
            ib: config.ib_id
        }),
        'tags': $resource(config.api_srv + '/get/tags/:ib/:page', {
            ib: config.ib_id,
            page: '@page'
        }),
        'tagtypes': $resource(config.api_srv + '/get/tagtypes', {}, {
            get: {
                cache: true
            }
        }),
        'tagsearch': $resource(config.api_srv + '/get/tagsearch/:ib', {
            ib: config.ib_id
        }),
        'tag': $resource(config.api_srv + '/get/tag/:ib/:id/:page', {
            ib: config.ib_id,
            id: '@id',
            page: '@page'
        }),
        'post': $resource(config.api_srv + '/get/post/:ib/:thread/:id', {
            ib: config.ib_id,
            thread: '@thread',
            id: '@id'
        }, {
            get: {
                cache: true
            }
        }),
        'addtag': $resource(config.api_srv + '/post/tag/add', {}),
        'newtag': $resource(config.api_srv + '/post/tag/new', {}, {}),
    };
});
