// comment-handler uses a regex to parse out quotes from a post starting with >> and adds them to an array
// it then sends the generated quotes to the quotebox directive which will create a popup with the posts
angular.module('prim').directive('quoteboxCommentHandler', function(emoticons, urls) {
    return {
        restrict: 'E',
        scope: {
            post: '=',
            thread: '='
        },
        templateUrl: "pages/box_comment.html",
        controllerAs: 'quoteboxCommentHandler',
        controller: function($scope, $filter) {

            var comment = $scope.post.comment;

            // add emoticons
            comment = emoticons.injectTags(comment);
            // add links
            comment = urls.createLinks(comment);

            // set scope
            $scope.post.comment = comment;

        }

    };

});
