// DirectoryCtrl is the controller for the directory page
angular.module('prim').controller('DirectoryCtrl', function($scope, $routeParams, $location, data, hotkeys, Handlers, AuthUtils) {

    // using controllerAs
    var self = this;

    // current page for pagination
    self.currentPage = $routeParams.page || 1;
    // watch for pagination changes and change route
    $scope.$watch(function() {
        return self.currentPage;
    }, function(value, old) {
        if (!angular.equals(value, old)) {
            $location.path('/directory/' + value);
        }
    });

    // compare last active date
    self.getLastActive = AuthUtils.getLastActive;

    if (angular.isDefined(data)) {
        self.data = data.directory.items;
        // Pagination items from json
        self.pagination = {
            totalItems: data.directory.total,
            currentPage: data.directory.current_page,
            numPages: data.directory.pages,
            itemsPerPage: data.directory.per_page,
            maxSize: 3
        };
    }

    // set default column and order for table sorting
    self.sort = {
        column: 'last_post',
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

    // async directory search
    self.searchThreads = function() {
        if (self.searchterm) {
            return Handlers.threadsearch.get({
                search: self.searchterm
            }).$promise.then(function(data) {
                self.data = data.threadsearch;
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
                    $location.path('/directory/' + page);
                }
            }
        })
        .add({
            combo: 'shift+right',
            description: 'Next Page',
            callback: function() {
                if (self.pagination.currentPage < self.pagination.numPages) {
                    var page = self.pagination.currentPage + 1;
                    $location.path('/directory/' + page);
                }
            }
        });

});
