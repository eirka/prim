// register a new account
angular.module('prim').service('RegisterHandler', function($resource, config) {
    return $resource(config.api_srv + '/post/register', {}, {
        save: {
            method: 'POST'
        }
    });
});
