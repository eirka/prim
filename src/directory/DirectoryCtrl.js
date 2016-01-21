// DirectoryCtrl is the controller for the directory page
angular.module('prim').controller('DirectoryCtrl', function(data, Handlers) {

    // using controllerAs
    var self = this;

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

});
