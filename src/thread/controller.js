angular.module('prim').controller('ThreadCtrl', function($window, $location, $scope, $routeParams, hotkeys, config, internal, ThreadHandler, Utils) {

    // using controllerAs
    var self = this;

    // set antispam key 
    self.as_key = internal.as_key;

    // Variable for grid or list view as default
    self.layout = 'list';

    // get the thumb address
    self.thumb = Utils.getThumbSrc;

    // get quote if there is one
    self.quote = Utils.getQuote();

    // clear the quote if page change
    $scope.$on('$locationChangeStart', function() {
        Utils.clearQuote();
    });

    // go to page 1 if something is fishy
    if (angular.isUndefined($routeParams.page)) {
        $routeParams.page = 1;
    }

    // Get thread json and set scope
    ThreadHandler.get({
        id: $routeParams.id,
        page: $routeParams.page
    }, function(data) {
        self.data = data.thread.items;
        // Set page title from thread title
        $scope.page.setTitle(self.data.title);
        // Pagination items from json
        self.pagination = {
            totalItems: data.thread.total,
            currentPage: data.thread.current_page,
            numPages: data.thread.pages,
            itemsPerPage: data.thread.per_page,
            maxSize: 3
        };
    }, function(error) {
        Utils.apiError(error.status);
    });

    // add post num to comment box
    self.replyQuote = function(id) {
        Utils.setQuote(id);
        self.quote = Utils.getQuote();
        $window.scrollTo(0, 0);
    };

    hotkeys.bindTo($scope)
        .add({
            combo: 'g',
            description: 'Grid View',
            callback: function() {
                self.layout = 'grid';
            }
        })
        .add({
            combo: 'l',
            description: 'List View',
            callback: function() {
                self.layout = 'list';
            }
        })
        .add({
            combo: 'shift+left',
            description: 'Previous Page',
            callback: function() {
                if (self.pagination.currentPage > 1) {
                    var page = self.pagination.currentPage - 1;
                    $location.path('/thread/' + $routeParams.id + '/' + page);
                }
            }
        })
        .add({
            combo: 'shift+right',
            description: 'Next Page',
            callback: function() {
                if (self.pagination.currentPage < self.pagination.numPages) {
                    var page = self.pagination.currentPage + 1;
                    $location.path('/thread/' + $routeParams.id + '/' + page);
                }
            }
        });

});


// handles the page post form
angular.module('prim').controller('ThreadFormCtrl', function($scope, AuthService, Utils) {

    // using controllerAs
    var self = this;

    // get a copy of authstate
    self.authState = angular.copy($scope.authState);

    // generate post form action
    self.getFormAction = Utils.getFormAction;

    // get jwt token for form
    self.token = AuthService.getToken();

});
