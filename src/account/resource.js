// register a new account
angular.module('prim').service('RegisterHandler', function($resource, config) {
    return $resource(config.api_srv + '/post/register', {}, {
        save: {
            method: 'POST'
        }
    });
});

// log in 
angular.module('prim').service('LoginHandler', function($resource, config) {
    return $resource(config.api_srv + '/post/login', {}, {
        save: {
            method: 'POST'
        }
    });
});

// who am i
angular.module('prim').service('WhoAmIHandler', function($resource, config) {
    return $resource(config.api_srv + '/get/whoami', {}, {
        get: {
            method: 'GET'
        }
    });
});
