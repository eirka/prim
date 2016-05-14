// error interceptor
angular.module('prim').factory('errorInterceptor', function($q, $injector, $location, toaster, user_messages, Utils, AuthStorage) {
    return {
        'responseError': function(response) {
            if (angular.equals(response.status, 401)) {
                // inject route for page reload
                var $route = $injector.get('$route');
                // the JWT session is bad so reset state and ask user to re-login
                AuthStorage.destroySession();
                // reload the current page with the auth header removed
                $route.reload();
                return;
            } else if (angular.equals(response.status, 403)) {
                // if forbidden forward to the login page
                $location.path('/account');
                toaster.pop('error', response.data.error_message);
                return;
            } else if (angular.equals(response.status, -1)) {
                // if there is a weird error the app probably cant contact the api server
                Utils.apiError(502);
            }
            return $q.reject(response);
        }
    };
});
