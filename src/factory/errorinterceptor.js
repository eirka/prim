// error interceptor
angular.module('prim').factory('errorInterceptor', function($q, $injector, $location, toaster, user_messages, AuthStorage) {
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
            }
            return $q.reject(response);
        }
    };
});
