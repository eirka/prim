// PostModCtrl includes mod functions for a post
angular.module('prim').controller('PostModCtrl', function($route, toaster, ModHandlers) {

    // using controllerAs
    var self = this;

    // delete a post
    self.deletePost = function(thread_id, post_id) {
        if (confirm("Are you sure you want to delete this post?")) {
            ModHandlers.deletepost.remove({
                thread: thread_id,
                id: post_id
            }, function(data) {
                $route.reload();
                toaster.pop('success', data.success_message);
            }, function(error) {
                toaster.pop('error', error.data.error_message);
            });
        }
    };

});
