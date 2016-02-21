// IndexCtrl is the controller for the index pages
angular.module('prim').controller('IndexCtrl', function($location, $scope, $routeParams, $route, AuthService, data, hotkeys, config, Utils) {

    // using controllerAs
    var self = this;

    // current page for pagination
    self.currentPage = $routeParams.page || 1;
    // watch for pagination changes and change route
    $scope.$watch(function() {
        return self.currentPage;
    }, function(value, old) {
        if (!angular.equals(value, old)) {
            $location.path('/page/' + value);
        }
    });

    // set csrf token
    self.csrf_token = config.csrf_token;

    // Set imageboard id
    self.ib_id = config.ib_id;

    // selects usergroup class
    self.usergroupClass = Utils.usergroupClass;

    // get avatar
    self.getAvatar = Utils.getAvatar;

    // make thumbnail source
    self.getThumbSrc = Utils.getThumbSrc;

    // compare last active date
    self.getLastActive = AuthService.getLastActive;

    if (angular.isDefined(data)) {
        self.data = data.index.items;
        // Pagination items from json
        self.pagination = {
            totalItems: data.index.total,
            currentPage: data.index.current_page,
            numPages: data.index.pages,
            itemsPerPage: data.index.per_page,
            maxSize: 5
        };
    }

    // Add quote post num to scope and forward to threads last page
    self.replyQuote = function(id, thread, last) {
        Utils.setQuote(id);
        $location.path('/thread/' + thread + '/' + last);
    };

    hotkeys.bindTo($scope)
        .add({
            combo: 'shift+left',
            description: 'Previous Page',
            callback: function() {
                if (self.pagination.currentPage > 1) {
                    var page = self.pagination.currentPage - 1;
                    $location.path('/page/' + page);
                }
            }
        })
        .add({
            combo: 'shift+right',
            description: 'Next Page',
            callback: function() {
                if (self.pagination.currentPage < self.pagination.numPages) {
                    var page = self.pagination.currentPage + 1;
                    $location.path('/page/' + page);
                }
            }
        });

});
