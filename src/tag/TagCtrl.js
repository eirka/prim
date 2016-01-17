// TagCtrl is the controller for the tag pages
angular.module('prim').controller('TagCtrl', function($scope, $routeParams, $location, data, hotkeys, Utils, AuthService) {

    // using controllerAs
    var self = this;

    // if mod controls should be shown or not
    self.showModControls = AuthService.showModControls;

    // make thumbnail source 
    self.getThumbSrc = Utils.getThumbSrc;

    if (angular.isDefined(data)) {
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
    }

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
    };

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
