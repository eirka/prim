// quotebox takes the quotes from comment-handler and 
angular.module('prim').directive('quoteBox', function(PostHandler, Utils) {
    return {
        restrict: 'A',
        transclude: true,
        scope: {
            id: '=',
            thread: '='
        },
        templateUrl: "pages/hover.html",
        link: function($scope, $element, $attrs) {
            // Hoverbox code
            $scope.show = {
                card: false
            };

            $scope.hoverTmplUrl = $attrs.hoverTmplUrl;
            $scope.onHoverIn = $scope.$eval($attrs.onHoverIn);
            $scope.onHoverOut = $scope.$eval($attrs.onHoverOut);

            // make quote text
            $scope.getText = function(id) {
                return '>>' + id
            };

            // get the thumb address
            $scope.thumb = Utils.getThumbSrc;

            // Get single post on hover
            $scope.getPost = function(id) {
                PostHandler.get({
                    thread: $scope.thread.id,
                    id: id
                }, function(data) {
                    $scope.quotebox = data;
                }, function(error) {
                    $scope.error = error.data;
                });
            };

        }

    };

});
