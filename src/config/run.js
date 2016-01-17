angular.module('prim').run(function($window, config, $rootScope, AuthService) {
    // Add page.title scope for dynamic page titles
    $rootScope.page = {
        setTitle: function(title) {
            this.title = title + ' | ' + config.title;
        }
    };

    // Change page title on route change
    $rootScope.$on('$routeChangeSuccess', function(event, current) {
        // scroll to the top on route change
        $window.scrollTo(0, 0);
        // set title
        $rootScope.page.setTitle(current.$$route.title || '');
    });

    // restore the initial auth state when first loaded
    AuthService.setAuthState();

});
