angular.module('prim').controller('PopularCtrl', function($scope, $routeParams, $location, PopularHandler, Utils) {

    // using controllerAs
    var self = this;

    // get the thumb address
    self.thumb = Utils.getThumbSrc;

    // Get tag page json
    PopularHandler.get(function(data) {
        self.data = data.popular;
    }, function(error) {
        Utils.apiError(error.status);
    });

});
