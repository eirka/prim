// creates a popup box for the comment quotes
angular.module('prim').directive('commentQuotes', function() {
    return {
        restrict: 'E',
        scope: {
            id: '=',
            thread: '='
        },
        templateUrl: "pages/hover.html",
        link: function(scope) {

            // Hoverbox code
            scope.show = false;

            // toggle menu visibility
            scope.toggle = function() {
                scope.show = !scope.show;
            };

            scope.open = function() {
                scope.show = true;
            };

            scope.close = function() {
                scope.show = false;
            };

        }
    };
});
