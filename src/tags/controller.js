angular.module('prim').controller('TagsCtrl', function($scope, $routeParams, $location, data, hotkeys, Handlers) {

    // using controllerAs
    var self = this;

    if (angular.isDefined(data)) {
        self.data = data.tags.items;
        // Pagination items from json
        self.pagination = {
            totalItems: data.tags.total,
            currentPage: data.tags.current_page,
            numPages: data.tags.pages,
            itemsPerPage: data.tags.per_page,
            maxSize: 3
        };
    }

    // selects a row color
    self.rowClass = function(type) {
        switch (type) {
            case 2:
                return "row-artist";
            case 3:
                return "row-character";
            case 4:
                return "row-copyright";
            default:
                return;
        }
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

    // async tag search
    self.searchTags = function() {
        if (self.searchterm) {
            return Handlers.tagsearch.get({
                search: self.searchterm
            }).$promise.then(function(data) {
                self.data = data.tagsearch;
                return self.data;
            });
        } else {
            self.updateTags();
        }
    };

    hotkeys.bindTo($scope)
        .add({
            combo: 'shift+left',
            description: 'Previous Page',
            callback: function() {
                if (self.pagination.currentPage > 1) {
                    var page = self.pagination.currentPage - 1;
                    $location.path('/tags/' + page);
                }
            }
        })
        .add({
            combo: 'shift+right',
            description: 'Next Page',
            callback: function() {
                if (self.pagination.currentPage < self.pagination.numPages) {
                    var page = self.pagination.currentPage + 1;
                    $location.path('/tags/' + page);
                }
            }
        });

});

angular.module('prim').controller('NewTagsCtrl', function($scope, Handlers, toaster, config, Utils) {

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
            $scope.tags.updateTags();
            toaster.pop('success', data.success_message);
        }, function(error) {
            toaster.pop('error', error.data.error_message);
        });
    };

});
