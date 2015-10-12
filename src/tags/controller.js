angular.module('prim').controller('TagsCtrl', function($routeParams, toaster, config, internal, TagsHandler, TagTypesHandler, TagDeleteHandler, TagsNewTag, Utils) {

    // using controllerAs
    var self = this;

    // go to page 1 if something is fishy
    if (angular.isUndefined($routeParams.page)) {
        $routeParams.page = 1;
    }

    // selects a row color
    self.rowClass = function(type) {
        var rowclass = "";

        switch (type) {
            case 2:
                rowclass = "row-artist";
                break;
            case 3:
                rowclass = "row-character";
                break;
            case 4:
                rowclass = "row-copyright";
                break;
            default:
                rowclass = "";
                break;
        }

        return rowclass
    }

    // this is a function so we can reload it if someone makes a new tag
    self.updateTags = function() {
        self.notags = false;
        TagsHandler.get({
            page: $routeParams.page
        }, function(data) {
            self.data = data.tags.items;
            // Pagination items from json
            self.pagination = {
                totalItems: data.tags.total,
                currentPage: data.tags.current_page,
                numPages: data.tags.pages,
                itemsPerPage: data.tags.per_page,
                maxSize: 3
            };
        }, function(error) {
            if (angular.equals(error.status, 404)) {
                self.notags = true;
            } else {
                Utils.apiError(error.status);
            }
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
    self.deleteTag = function(tag_id) {
        if (confirm("Are you sure you want to delete this tag?")) {
            TagDeleteHandler.remove({
                id: tag_id
            }, function(data) {
                self.updateTags();
                toaster.pop('success', data.success_message);
            }, function(error) {
                toaster.pop('error', error.data.error_message);
            });
        };
    };

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
        if (angular.equals(sort.column, column)) {
            sort.desc = !sort.desc;
        } else {
            sort.column = column;
            sort.desc = false;
        }
    };

});
