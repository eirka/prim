// quotebox takes the quotes from comment-handler and makes a popup box with the post data
angular.module('prim').directive('quoteBox', function($filter, PostHandler, Utils, emoticons) {
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

            $scope.hoverTmplUrl = "pages/box.html";
            $scope.onHoverIn = $scope.$eval($attrs.onHoverIn);
            $scope.onHoverOut = $scope.$eval($attrs.onHoverOut);

            // make quote text
            $scope.getText = function(id) {
                return '>>' + id;
            };

            // selects usergroup class
            $scope.usergroupClass = Utils.usergroupClass;

            // get the thumb address
            $scope.thumb = Utils.getThumbSrc;

            // get the avatar address
            $scope.avatar = Utils.getAvatar;

            // Get single post on hover
            $scope.getPost = function(id) {
                PostHandler.get({
                    thread: $scope.thread,
                    id: id
                }, function(data) {
                    $scope.quotebox = data;

                    var comment = $scope.quotebox.post.comment;

                    // add emoticons
                    comment = emoticons.injectTags(comment);

                    // add embed filter
                    $scope.comment = $filter('embed')(comment);

                }, function(error) {
                    $scope.error = error.data;
                });
            };

        }

    };

});
