angular.module('prim').controller('PopularCtrl', function(PopularHandler, Utils) {

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

angular.module('prim').controller('NewCtrl', function(NewHandler, Utils) {

    // using controllerAs
    var self = this;

    // get the thumb address
    self.thumb = Utils.getThumbSrc;

    // Get tag page json
    NewHandler.get(function(data) {
        self.data = data.new;
    }, function(error) {
        Utils.apiError(error.status);
    });

});
