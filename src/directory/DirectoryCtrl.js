// DirectoryCtrl is the controller for the directory page
angular.module('prim').controller('DirectoryCtrl', function(data) {

    // using controllerAs
    var self = this;

    if (angular.isDefined(data)) {
        self.data = data.directory;
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

});
