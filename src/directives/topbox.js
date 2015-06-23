angular.module('prim').directive('topBox', function() {
    return {
        restrict: 'E',
        templateUrl: 'pages/totop.html',
        scope: {},
        controllerAs: 'topbox',
        controller: function($scope, $window) {
            // using controllerAs
            var self = this;

            angular.element($window).bind("scroll", function() {
                self.showbox = false;

                if (window.pageYOffset > 300) {
                    self.showbox = true;
                } else {
                    self.showbox = false;
                }

                $scope.$applyAsync();

            });

            self.scrollToTop = function() {
                $window.scrollTo(0, 0);
            };

        }
    };
});
