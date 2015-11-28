// mod functions for threads
angular.module('prim').controller('ThreadModCtrl', function($location, $route, toaster, ModHandlers, Utils) {

    // using controllerAs
    var self = this;

    // toggle thread close status
    self.closeThread = function(thread_id) {
        ModHandlers.close.save({
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
        ModHandlers.sticky.save({
            id: thread_id
        }, function(data) {
            $route.reload();
            toaster.pop('success', data.success_message);
        }, function(error) {
            toaster.pop('error', error.data.error_message);
        });
    };



    // delete a thread
    self.deleteThread = function(thread_id) {
        if (confirm("Are you sure you want to delete this thread?")) {
            ModHandlers.deletethread.remove({
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


// mod functions for threads
angular.module('prim').controller('PostModCtrl', function($route, toaster, ModHandlers, Utils) {

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
        };
    };

});
