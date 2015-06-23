angular.module('prim').controller('IndexCtrl', function($location, $routeParams, config, internal, IndexHandler, Utils) {

    // using controllerAs
    var self = this;

    // set antispam key 
    self.as_key = internal.as_key;
    // Set imageboard id
    self.ib_id = config.ib_id;

    // get the thumb address
    self.thumb = Utils.getThumbSrc;

    // generate post form action
    self.getFormAction = Utils.getFormAction;

    // this will set the page num to 1 if coming from root
    if (!$routeParams.id) {
        $routeParams.id = 1;
    }

    // Get index json
    IndexHandler.get({
        id: $routeParams.id
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

});
