// utility functions for auth state
angular.module('prim').factory('AuthUtils', function($rootScope) {

    var AuthUtils = {
        // show mod controls if user is mod or admin
        showModControls: function() {
            if ($rootScope.authState.isAuthenticated) {
                switch ($rootScope.ibData.group) {
                    case 3:
                        return true;
                    case 4:
                        return true;
                    default:
                        return false;
                }
            }
            return false;
        },
        // compares the given date to the users last active time
        getLastActive: function(date) {
            if (angular.isDefined(date)) {
                date = new Date(date);
                if (angular.isDate(date)) {
                    return $rootScope.authState.lastactive < date;
                }
                return false;
            }
            return false;
        }
    };

    return AuthUtils;

});
