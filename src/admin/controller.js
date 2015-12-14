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

// deletes a tag on the tags page
angular.module('prim').controller('DeleteTagCtrl', function($scope, ModHandlers, toaster) {

    // using controllerAs
    var self = this;

    // Function for adding a tag, updates tag list on success
    self.deleteTag = function(tag_id) {
        if (confirm("Are you sure you want to delete this tag?")) {
            ModHandlers.deletetag.delete({
                id: tag_id
            }, function(data) {
                $scope.tags.updateTags();
                toaster.pop('success', data.success_message);
            }, function(error) {
                toaster.pop('error', error.data.error_message);
            });
        };
    };

});


// updates a tag
angular.module('prim').controller('UpdateTagCtrl', function($scope, $route, Handlers, ModHandlers, toaster, config, internal) {

    // using controllerAs
    var self = this;

    // Get tag types for selector
    Handlers.tagtypes.get(function(data) {
        self.tagtypes = data.tagtypes;
    }, function(error) {
        Utils.apiError(error.status);
    });

    // watch for the tag name from the parent resource
    $scope.$watch('tag.data.tag', function(n) {
        self.name = n;
    }, true);

    // Function for adding a tag, updates tag list on success
    self.updateTag = function(tag_id) {
        ModHandlers.updatetag.save({
            id: $scope.tag.data.id,
            ib: config.ib_id,
            name: self.name,
            type: self.selected,
            askey: internal.as_key
        }, function(data) {
            $route.reload();
            toaster.pop('success', data.success_message);
        }, function(error) {
            toaster.pop('error', error.data.error_message);
        });
    };

});
