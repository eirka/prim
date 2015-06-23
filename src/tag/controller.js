angular.module('prim').controller('TagCtrl', function($scope, $routeParams, TagHandler, Utils) {

    // using controllerAs
    var self = this;

    // get the thumb address
    self.thumb = Utils.getThumbSrc;

    // Get tag page json
    TagHandler.get({
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
    }, function(error) {
        Utils.apiError(error.status);
    });

});
