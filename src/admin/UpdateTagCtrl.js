// UpdateTagCtrl will update a tag
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
