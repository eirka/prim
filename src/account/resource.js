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

// change password
angular.module('prim').service('PasswordHandler', function($resource, config) {
    return $resource(config.api_srv + '/post/user/password', {}, {
        save: {
            method: 'POST'
        }
    });
});

// change email
angular.module('prim').service('EmailHandler', function($resource, config) {
    return $resource(config.api_srv + '/post/user/email', {}, {
        save: {
            method: 'POST'
        }
    });
});

// who am i
angular.module('prim').service('WhoAmIHandler', function($resource, config) {
    return $resource(config.api_srv + '/get/user/whoami/:ib', {
        ib: config.ib_id
    }, {
        get: {
            method: 'GET'
        }
    });
});
