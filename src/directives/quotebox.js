// quotebox takes the quotes from comment-handler and 
angular.module('prim').directive('quoteBox', function($compile, PostHandler, Utils) {
    return {
        restrict: 'A',
        transclude: true,
        scope: {
            ids: '=',
            thread: '='
        },
        templateUrl: "pages/hover.html",
        link: function($scope, $element, $attrs) {
            // Compile link html from commenthandler
            var element = angular.element($scope.links);
            var test = $compile(element)($scope);
            element.append(test);

            // Hoverbox code
            $scope.show = {};
            $scope.show.card = false;
            $scope.hoverTmplUrl = $attrs.hoverTmplUrl;
            $scope.onHoverIn = $scope.$eval($attrs.onHoverIn);
            $scope.onHoverOut = $scope.$eval($attrs.onHoverOut);

            // get the thumb address
            $scope.thumb = Utils.getThumbSrc;

            // Get single post on hover
            $scope.getPost = function(post_id) {
                PostHandler.get({
                    thread: $scope.thread.id,
                    id: post_id
                }, function(data) {
                    $scope.quotebox = data;
                }, function(error) {
                    $scope.error = error.data;
                });
            };

        }

    };
});
