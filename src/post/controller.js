angular.module('prim').controller('getPost', function(Post, $location, $routeParams, $scope, Utils) {

    // Get tag page json
    Post.get({
        thread: $routeParams.id,
        id: $routeParams.post
    }, function(data) {
        $scope.data = data;
        $scope.post = data.post;
        // Set page title with tag name
        $scope.page.setTitle('Post ' + $scope.post.thread_id + '/' + $scope.post.num);

        $scope.replyQuote = function(id, thread, last) {
            Utils.setQuote(id);
            $location.path('/thread/' + thread + '/' + last);
        };

    }, function(error) {
        Utils.apiError(error.status);
    });

});
