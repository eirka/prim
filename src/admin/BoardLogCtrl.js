// BoardStatisticsCtrl generates a chart and shows the statistics for an imageboard
angular.module('prim').controller('BoardLogCtrl', function($scope, hotkeys, ModHandlers, Utils) {

    // using controllerAs
    var self = this;

    self.currentPage = 1;

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
        ModHandlers.boardlog.get({
            page: page
        }, function(data) {
            self.data = data.boardlog.items;
            self.pagination = {
                totalItems: data.boardlog.total,
                currentPage: data.boardlog.current_page,
                numPages: data.boardlog.pages,
                itemsPerPage: data.boardlog.per_page,
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
