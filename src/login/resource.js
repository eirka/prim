// log in 
angular.module('prim').service('LoginHandler', function($resource, config) {
    return $resource(config.api_srv + '/post/login', {}, {
        save: {
            method: 'POST'
        }
    });
});
