angular.module('prim').controller('IndexCtrl', function($location, $routeParams, $scope, $route, hotkeys, config, internal, IndexHandler, Utils) {

    // using controllerAs
    var self = this;

    // set antispam key 
    self.as_key = internal.as_key;
    // Set imageboard id
    self.ib_id = config.ib_id;

    // selects usergroup class
    self.usergroupClass = Utils.usergroupClass;

    // get the thumb address
    self.thumb = Utils.getThumbSrc;

    // go to page 1 if something is fishy
    if (angular.isUndefined($routeParams.page)) {
        $routeParams.page = 1;
    }

    // Get index json
    IndexHandler.get({
        page: $routeParams.page
    }, function(data) {
        self.data = data.index.items;
        // Pagination items from json
        self.pagination = {
            totalItems: data.index.total,
            currentPage: data.index.current_page,
            numPages: data.index.pages,
            itemsPerPage: data.index.per_page,
            maxSize: 5
        };
        // Add quote post num to scope and forward to threads last page
        self.replyQuote = function(id, thread, last) {
            Utils.setQuote(id);
            $location.path('/thread/' + thread + '/' + last);
        };
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

// handles the page post form
angular.module('prim').controller('IndexFormCtrl', function($scope, AuthService, Utils) {

    // using controllerAs
    var self = this;

    // generate post form action
    self.getFormAction = Utils.getFormAction;

    // get jwt token for form
    self.token = AuthService.getToken();

});
