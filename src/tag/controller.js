angular.module('prim').controller('TagCtrl', function($scope, $routeParams, $location, hotkeys, Handlers, Utils) {

    // using controllerAs
    var self = this;

    // selects a row color
    self.rowClass = function(type) {
        switch (type) {
            case 1:
                return "tagpage-tag";
            case 2:
                return "tagpage-artist";
            case 3:
                return "tagpage-character";
            case 4:
                return "tagpage-copyright";
            default:
                return "";
        }
    }

    // go to page 1 if something is fishy
    if (angular.isUndefined($routeParams.page)) {
        $routeParams.page = 1;
    }

    // Get tag page json
    Handlers.tag.get({
        id: $routeParams.id,
        page: $routeParams.page
    }, function(data) {
        self.data = data.tag.items;
        // Set page title with tag name
        $scope.page.setTitle(self.data.tag);
        // Pagination items from json
        self.pagination = {
            totalItems: data.tag.total,
            currentPage: data.tag.current_page,
            numPages: data.tag.pages,
            itemsPerPage: data.tag.per_page,
            maxSize: 3
        };

        // modify content
        angular.forEach(self.data.images, function(image) {
            image.thumbnail = Utils.getThumbSrc(image.thumbnail, image.filename);
        });

    }, function(error) {
        Utils.apiError(error.status);
    });

    hotkeys.bindTo($scope)
        .add({
            combo: 'shift+left',
            description: 'Previous Page',
            callback: function() {
                if (self.pagination.currentPage > 1) {
                    var page = self.pagination.currentPage - 1;
                    $location.path('/tag/' + $routeParams.id + '/' + page);
                }
            }
        })
        .add({
            combo: 'shift+right',
            description: 'Next Page',
            callback: function() {
                if (self.pagination.currentPage < self.pagination.numPages) {
                    var page = self.pagination.currentPage + 1;
                    $location.path('/tag/' + $routeParams.id + '/' + page);
                }
            }
        });

});
