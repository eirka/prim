angular.module('prim').run(function(config, $rootScope) {
    // Add page.title scope for dynamic page titles
    $rootScope.page = {
        setTitle: function(title) {
            this.title = title + ' | ' + config.title;
        }
    };

    // Change page title on route change
    $rootScope.$on('$routeChangeSuccess', function(event, current) {
        $rootScope.page.setTitle(current.$$route.title || '');
    });
});
