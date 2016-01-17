// global admin panel controller
angular.module('prim').controller('AdminCtrl', function() {

    // using controllerAs
    var self = this;

    self.data = {};

});

// imageboard statistics
angular.module('prim').controller('BoardStatisticsCtrl', function($route, dateFilter, ModHandlers, Utils) {

    // using controllerAs
    var self = this;

    // chart labels
    self.labels = [];
    // the chart series names
    self.series = [];
    // the chart datapoints
    self.chartdata = [];

    self.colors = ['#BF4848', '#4883BF'];

    // chart options
    self.options = {
        scaleShowGridLines: false,
        pointDot: false,
        datasetStroke: false,
        scaleFontSize: 8,
        scaleSteps: 10,
        bezierCurve: false,
    };

    // Get the image json from pram
    ModHandlers.statistics.get({}, function(data) {
        self.data = data;

        // format the dates
        angular.forEach(data.labels, function(value) {
            self.labels.push(dateFilter(value, 'M/d h:mma'));
        });

        // push the data
        angular.forEach(data.series, function(value) {
            self.series.push(value.name);
            self.chartdata.push(value.data);
        });

    }, function(error) {
        Utils.apiError(error.status);
    });

});

// mod functions for threads
angular.module('prim').controller('ThreadModCtrl', function($location, $route, toaster, ModHandlers) {

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
        }
    };

});


// mod functions for threads
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

// deletes a tag on the tags page
angular.module('prim').controller('DeleteTagCtrl', function($scope, $location, ModHandlers, toaster) {

    // using controllerAs
    var self = this;

    // Function for adding a tag, updates tag list on success
    self.deleteTag = function(tag_id) {
        if (confirm("Are you sure you want to delete this tag?")) {
            ModHandlers.deletetag.delete({
                id: tag_id
            }, function(data) {
                $location.path("/tags");
                toaster.pop('success', data.success_message);
            }, function(error) {
                toaster.pop('error', error.data.error_message);
            });
        }
    };

});


// updates a tag
angular.module('prim').controller('UpdateTagCtrl', function($scope, $route, Handlers, ModHandlers, toaster, config, Utils) {

    // using controllerAs
    var self = this;

    // Get tag types for selector
    Handlers.tagtypes.get(function(data) {
        self.tagtypes = data.tagtypes;
    }, function(error) {
        Utils.apiError(error.status);
    });

    // watch for the tag name from the parent resource
    $scope.$watchGroup(['tag.data.tag', 'tag.data.type'], function(n) {
        self.name = n[0];
        self.selected = n[1];
    }, true);

    // Function for adding a tag, updates tag list on success
    self.updateTag = function() {
        ModHandlers.updatetag.save({
            id: $scope.tag.data.id,
            ib: config.ib_id,
            name: self.name,
            type: self.selected
        }, function(data) {
            $route.reload();
            toaster.pop('success', data.success_message);
        }, function(error) {
            toaster.pop('error', error.data.error_message);
        });
    };

});
