// FavoritesCtrl will get the users favorites
angular.module('prim').controller('FavoritesCtrl', function($scope, $routeParams, $location, data, hotkeys, Utils) {

    // using controllerAs
    var self = this;

    // current page for pagination
    self.currentPage = $routeParams.page || 1;
    // watcher for pagination navigation
    $scope.$watch(function() {
        return self.currentPage;
    }, function(value, old) {
        if (!angular.equals(value, old)) {
            $location.path('/favorites/' + value);
        }
    });

    // make thumbnail source
    self.getThumbSrc = Utils.getThumbSrc;

    if (angular.isDefined(data)) {
        self.data = data.favorites.items;
        // Pagination items from json
        self.pagination = {
            totalItems: data.favorites.total,
            currentPage: data.favorites.current_page,
            numPages: data.favorites.pages,
            itemsPerPage: data.favorites.per_page,
            maxSize: 3
        };
    }

    hotkeys.bindTo($scope)
        .add({
            combo: 'shift+left',
            description: 'Previous Page',
            callback: function() {
                if (self.pagination.currentPage > 1) {
                    var page = self.pagination.currentPage - 1;
                    $location.path('/favorites/' + page);
                }
            }
        })
        .add({
            combo: 'shift+right',
            description: 'Next Page',
            callback: function() {
                if (self.pagination.currentPage < self.pagination.numPages) {
                    var page = self.pagination.currentPage + 1;
                    $location.path('/favorites/' + page);
                }
            }
        });

});
