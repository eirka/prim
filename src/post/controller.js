angular.module('prim').controller('PostCtrl', function($location, $routeParams, $scope, PostHandler, Utils) {

    // using controllerAs
    var self = this;

    // get the thumb address
    self.thumb = Utils.getThumbSrc;

    // Get tag page json
    PostHandler.get({
        thread: $routeParams.id,
        id: $routeParams.post
    }, function(data) {
        self.data = data.post;
        // Set page title with tag name
        $scope.page.setTitle('Post ' + self.data.thread_id + '/' + self.data.num);
        // Add quote post num to scope and forward to threads last page
        self.replyQuote = function(id, thread, last) {
            Utils.setQuote(id);
            $location.path('/thread/' + thread + '/' + last);
        };
    }, function(error) {
        Utils.apiError(error.status);
    });

});
