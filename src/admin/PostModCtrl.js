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

    // ban an IP
    self.banIp = function(thread_id, post_id) {
        // prompt user for ban reason
        var reason = prompt("Please enter a reason for the ban");
        if (reason) {
            ModHandlers.banip.save({
                thread: thread_id,
                id: post_id,
                reason: reason,
            }, function(data) {
                toaster.pop('success', data.success_message);
            }, function(error) {
                toaster.pop('error', error.data.error_message);
            });
        }
    };

    // ban an image file
    self.banFile = function(thread_id, post_id) {
        // prompt user for ban reason
        var reason = prompt("Please enter a reason for the ban");
        if (reason) {
            ModHandlers.banfile.save({
                thread: thread_id,
                id: post_id,
                reason: reason,
            }, function(data) {
                toaster.pop('success', data.success_message);
            }, function(error) {
                toaster.pop('error', error.data.error_message);
            });
        }
    };

});
