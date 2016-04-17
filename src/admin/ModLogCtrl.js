// BoardStatisticsCtrl generates a chart and shows the statistics for an imageboard
angular.module('prim').controller('ModLogCtrl', function($scope, hotkeys, ModHandlers, Utils) {

    // using controllerAs
    var self = this;

    // selects usergroup class
    self.usergroupClass = Utils.usergroupClass;

    self.currentPage = 1;

    // watcher for pagination navigation
    $scope.$watch(function() {
        return self.currentPage;
    }, function(value, old) {
        if (!angular.equals(value, old)) {
            self.getLog(value);
        }
    });

    // set default column and order for table sorting
    self.sort = {
        column: 'log_time',
        desc: true
    };

    // will get the log json
    self.getLog = function(page) {
        // update the page if needed
        self.currentPage = page;
        // Get the audit log json
        ModHandlers.modlog.get({
            page: page
        }, function(data) {
            self.data = data.modlog.items;
            self.pagination = {
                totalItems: data.modlog.total,
                currentPage: data.modlog.current_page,
                numPages: data.modlog.pages,
                itemsPerPage: data.modlog.per_page,
                maxSize: 3
            };
        }, function(error) {
            Utils.apiError(error.status);
        });
    };

    // get the first page
    self.getLog(self.currentPage);

    hotkeys.bindTo($scope)
        .add({
            combo: 'shift+left',
            description: 'Previous Page',
            callback: function() {
                if (self.pagination.currentPage > 1) {
                    var page = self.pagination.currentPage - 1;
                    self.getLog(page);
                }
            }
        })
        .add({
            combo: 'shift+right',
            description: 'Next Page',
            callback: function() {
                if (self.pagination.currentPage < self.pagination.numPages) {
                    var page = self.pagination.currentPage + 1;
                    self.getLog(page);
                }
            }
        });

});
