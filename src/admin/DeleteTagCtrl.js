// DeleteTagCtrl deletes a tag 
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
