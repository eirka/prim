angular.module('prim').controller('getTag', function($scope, Tag, $routeParams, Utils) {

    // Get tag page json
    Tag.get({
        id: $routeParams.id,
        page: $routeParams.page
    }, function(data) {
        $scope.data = data;
        $scope.tag = data.tag.items;

        // Pagination items from json
        $scope.totalItems = data.tag.total;
        $scope.currentPage = data.tag.current_page;
        $scope.numPages = data.tag.pages;
        $scope.itemsPerPage = data.tag.per_page;
        $scope.maxSize = 3;

        // Set page title with tag name
        $scope.page.setTitle($scope.tag.tag);
    }, function(error) {
        Utils.apiError(error.status);
    });

});
