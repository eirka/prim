// displays a loading icon during a route change
angular.module('prim').directive('loadingIndicator', function($rootScope) {
    return {
        restrict: 'E',
        templateUrl: 'pages/loading.html',
        link: function(scope) {
            scope.isRouteLoading = false;

            $rootScope.$on('$routeChangeStart', function() {
                scope.isRouteLoading = true;
            });

            $rootScope.$on('$routeChangeSuccess', function() {
                scope.isRouteLoading = false;
            });

        }
    };
});
