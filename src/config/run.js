angular.module('prim').run(function(config, $rootScope, AuthSession) {
    // Add page.title scope for dynamic page titles
    $rootScope.page = {
        setTitle: function(title) {
            this.title = title + ' | ' + config.title;
        }
    };

    // Change page title on route change
    $rootScope.$on('$routeChangeSuccess', function(event, current) {
        // set title
        $rootScope.page.setTitle(current.$$route.title || '');
    });

    // restore the initial auth state when first loaded
    AuthSession.setAuthState();

});
