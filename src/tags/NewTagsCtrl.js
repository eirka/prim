// NewTagsCtrl will create a new tag
angular.module('prim').controller('NewTagsCtrl', function(Handlers, toaster, config, Utils) {

    // using controllerAs
    var self = this;

    // Get tag types for selector
    Handlers.tagtypes.get(function(data) {
        self.tagtypes = data.tagtypes;
    }, function(error) {
        Utils.apiError(error.status);
    });

    // Function for adding a tag, updates tag list on success
    self.newTag = function() {
        Handlers.newtag.save({
            name: self.name,
            type: self.selected,
            ib: config.ib_id
        }, function(data) {
            toaster.pop('success', data.success_message);
        }, function(error) {
            toaster.pop('error', error.data.error_message);
        });
    };

});
