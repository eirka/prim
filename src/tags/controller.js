angular.module('prim').controller('TagsCtrl', function(toaster, config, internal, TagsHandler, TagTypesHandler, TagsNewTag, Utils) {

    // using controllerAs
    var self = this;

    // this is a function so we can reload it if someone makes a new tag
    self.updateTags = function() {
        TagsHandler.get(function(data) {
            self.data = data;
        }, function(error) {
            Utils.apiError(error.status);
        });
        self.error = null;
    };

    // initial load of tags
    self.updateTags();

    // Get tag types for selector
    TagTypesHandler.get(function(data) {
        self.tagtypes = data.tagtypes;
    }, function(error) {
        Utils.apiError(error.status);
    });

    // Function for adding a tag, updates tag list on success
    self.newTag = function() {
        TagsNewTag.save({
            name: self.name,
            type: self.selected,
            ib: config.ib_id,
            askey: internal.as_key
        }, function(data) {
            self.updateTags();
            toaster.pop('success', data.success_message);
        }, function(error) {
            toaster.pop('error', error.data.error_message);
        });
    };

    // set default column and order for table sorting
    self.sort = {
        column: 'total',
        desc: true
    };

    // reverse the sorting or change the column
    self.changeSorting = function(column) {
        var sort = self.sort;
        if (sort.column == column) {
            sort.desc = !sort.desc;
        } else {
            sort.column = column;
            sort.desc = false;
        }
    };

});
