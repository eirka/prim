angular.module('prim').controller('getIndex', function(config, internal, $scope, $location, Index, $routeParams, Utils) {

    $scope.as_key = internal.as_key;
    // Set imageboard id
    $scope.ib_id = config.ib_id;

    // generate post form action
    $scope.getFormAction = Utils.getFormAction;

    // if there is no page number go to page 1
    if (!$routeParams.id) {
        $routeParams.id = 1;
    }

    // Get index json
    Index.get({
        id: $routeParams.id
    }, function(data) {
        $scope.data = data;

        // Pagination items from json
        $scope.totalItems = data.index.total;
        $scope.currentPage = data.index.current_page;
        $scope.numPages = data.index.pages;
        $scope.itemsPerPage = data.index.per_page;
        $scope.maxSize = 5;

        // Add quote post num to scope and forward to threads last page
        $scope.replyQuote = function(id, thread, last) {
            Utils.setQuote(id);
            $location.path('/thread/' + thread + '/' + last);
        };

    }, function(error) {
        Utils.apiError(error.status);
    });

});
