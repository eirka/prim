// handlers for user functions
angular.module('prim').factory('UserHandlers', function($resource, config) {
    return {
        // whoami
        'whoami': $resource(config.api_srv + '/get/user/whoami/:ib', {
            ib: config.ib_id
        }),
        // user favorites
        'favorites': $resource(config.api_srv + '/get/user/favorites/:ib/:page', {
            ib: config.ib_id,
            page: '@page'
        }),
        // check if user has image favorited
        'favorite': $resource(config.api_srv + '/get/user/favorite/:id', {
            id: '@id'
        }),
        // register users
        'register': $resource(config.api_srv + '/post/register', {}),
        // login
        'login': $resource(config.api_srv + '/post/login', {}),
        // change password
        'password': $resource(config.api_srv + '/post/user/password', {}),
        // change email
        'email': $resource(config.api_srv + '/post/user/email', {}),
        // add favorite
        'addfavorite': $resource(config.api_srv + '/post/user/favorite', {})
    };
});
