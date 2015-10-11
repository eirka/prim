// mod functions for threads
angular.module('prim').controller('ThreadModCtrl', function($scope, $location, $route, toaster, ThreadDeleteHandler, PostDeleteHandler, CloseThreadHandler, StickyThreadHandler, Utils) {

    // using controllerAs
    var self = this;

    // toggle thread close status
    self.closeThread = function(thread_id) {
        CloseThreadHandler.save({
            id: thread_id
        }, function(data) {
            $route.reload();
            toaster.pop('success', data.success_message);
        }, function(error) {
            toaster.pop('error', error.data.error_message);
        });
    };

    // toggle thread sticky status
    self.stickyThread = function(thread_id) {
        StickyThreadHandler.save({
            id: thread_id
        }, function(data) {
            $route.reload();
            toaster.pop('success', data.success_message);
        }, function(error) {
            toaster.pop('error', error.data.error_message);
        });
    };

    // delete a post
    self.deletePost = function(thread_id, post_id) {
        if (confirm("Are you sure you want to delete this post?")) {
            PostDeleteHandler.remove({
                thread: thread_id,
                id: post_id
            }, function(data) {
                $route.reload();
                toaster.pop('success', data.success_message);
            }, function(error) {
                toaster.pop('error', error.data.error_message);
            });
        };
    };

    // delete a thread
    self.deleteThread = function(thread_id) {
        if (confirm("Are you sure you want to delete this thread?")) {
            ThreadDeleteHandler.remove({
                id: thread_id
            }, function(data) {
                $location.path('/');
                toaster.pop('success', data.success_message);
            }, function(error) {
                toaster.pop('error', error.data.error_message);
            });
        };
    };

});
