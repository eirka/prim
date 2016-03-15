// ThreadCtrl is the controller for the thread pages
angular.module('prim').controller('ThreadCtrl', function($window, $location, $scope, $routeParams, data, hotkeys, config, Utils, AuthService) {

    // drawpad controls
    $scope.drawpad = {
        visible: false,
        toggle: function() {
            $scope.drawpad.visible = !$scope.drawpad.visible;
        }
    };

    // using controllerAs
    var self = this;

    // current page for pagination
    self.currentPage = $routeParams.page || 1;
    // watch for pagination changes and change route
    $scope.$watch(function() {
        return self.currentPage;
    }, function(value, old) {
        if (!angular.equals(value, old)) {
            $location.path('/thread/' + $routeParams.id + '/' + value);
        }
    });

    // set csrf token
    self.csrf_token = config.csrf_token;

    // Variable for grid or list view as default
    self.layout = 'list';

    // if mod controls should be shown or not
    self.showModControls = AuthService.showModControls;

    // selects usergroup class
    self.usergroupClass = Utils.usergroupClass;

    // get quote if there is one
    self.quote = Utils.getQuote();

    // get avatar
    self.getAvatar = Utils.getAvatar;

    // make thumbnail source
    self.getThumbSrc = Utils.getThumbSrc;

    // compare last active date
    self.getLastActive = AuthService.getLastActive;

    // add post num to comment box
    self.replyQuote = function(id) {
        if (angular.isDefined(id)) {
            self.quote += " >>" + id + " ";
            $window.scrollTo(0, 0);
        }
    };

    // clear the quote if page change
    $scope.$on('$locationChangeStart', function() {
        Utils.clearQuote();
    });

    if (angular.isDefined(data)) {
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
    }

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
