// TagsCtrl is the controller for the tags page
angular.module('prim').controller('TagsCtrl', function($scope, $routeParams, $location, data, hotkeys, Handlers) {

    // using controllerAs
    var self = this;

    // current page for pagination
    self.currentPage = $routeParams.page || 1;
    // watcher for pagination navigation
    $scope.$watch(function() {
        return self.currentPage;
    }, function(value, old) {
        if (!angular.equals(value, old)) {
            $location.path('/tags/' + value);
        }
    });

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
