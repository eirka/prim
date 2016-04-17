angular.module('prim').run(function($anchorScroll, $document, $timeout, $location, $route, $window, $rootScope, config, AuthSession) {

    // if scroll position should be saved
    var saveScroll = true;
    // holds the scroll position
    var scrollPosCache = {};

    // Add page.title scope for dynamic page titles
    $rootScope.page = {
        setTitle: function(title) {
            this.title = title + ' | ' + config.title;
        }
    };

    $document.bind('scroll', function() {
        if (saveScroll) {
            // save scroll position for current route
            scrollPosCache[$location.path()] = [$window.pageXOffset, $window.pageYOffset];
        }
    });

    $rootScope.$on('$routeChangeStart', function() {
        saveScroll = false;
    });

    $rootScope.$on('$routeChangeSuccess', function(event, current) {
        // set page title
        $rootScope.page.setTitle(current.$$route.title || '');

        if ($location.hash()) {
            // if hash is specified in location it trumps previously stored scroll position
            $anchorScroll();
        } else {
            // else get previous scroll position; if none, scroll to the top of the page
            var prevScrollPos = scrollPosCache[$location.path()] || [0, 0];
            $timeout(function() {
                // scroll to position 
                $window.scrollTo(prevScrollPos[0], prevScrollPos[1]);
                saveScroll = true;
            }, 0);
        }
    });

    // restore the initial auth state when first loaded
    AuthSession.setAuthState();

});
