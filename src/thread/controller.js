angular.module('prim').controller('getThread', function(config, internal, Thread, $window, $location, $scope, $routeParams, Utils) {

    $scope.as_key = internal.as_key;
    $scope.ib_id = config.ib_id;
    // Variable for grid or list view as default
    $scope.layout = 'list';

    // generate post form action
    $scope.getFormAction = Utils.getFormAction;

    // if there is no page number go to page 1
    if (!$routeParams.page) {
        $routeParams.page = 1;
    }

    $scope.quote = Utils.getQuote();

    // clear the quote if page change
    $scope.$on('$locationChangeStart', function() {
        Utils.clearQuote();
    });

    // Get thread json and set scope
    Thread.get({
        id: $routeParams.id,
        page: $routeParams.page
    }, function(data) {
        $scope.data = data;
        $scope.thread = data.thread.items;
        // Set page title from thread title
        $scope.page.setTitle($scope.thread.title);
        // Pagination items from json
        $scope.totalItems = data.thread.total;
        $scope.currentPage = data.thread.current_page;
        $scope.numPages = data.thread.pages;
        $scope.itemsPerPage = data.thread.per_page;
        $scope.maxSize = 3;

    }, function(error) {
        Utils.apiError(error.status);
    });

    // add post num to comment box
    $scope.replyQuote = function(id) {
        Utils.setQuote(id);
        $scope.quote = Utils.getQuote();
        $window.scrollTo(0, 0);
    };

});
