// creates the arrow popup to scroll to the top of the page
angular.module('prim').directive('topBox', function() {
    return {
        restrict: 'E',
        templateUrl: 'pages/totop.html',
        scope: {},
        controllerAs: 'topbox',
        controller: function($scope, $window) {
            // using controllerAs
            var self = this;

            // bind to window scroll
            angular.element($window).bind("scroll", function() {
                self.showbox = false;

                // watch for the window offset 
                if (window.pageYOffset > 300) {
                    self.showbox = true;
                } else {
                    self.showbox = false;
                }

                $scope.$applyAsync();

            });

            // scrolls to the top of the page
            self.scrollToTop = function() {
                $window.scrollTo(0, 0);
            };

        }
    };
});
