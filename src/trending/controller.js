angular.module('prim').controller('PopularCtrl', function(Handlers, Utils) {

    // using controllerAs
    var self = this;

    // make thumbnail source 
    self.getThumbSrc = Utils.getThumbSrc;

    // Get tag page json
    Handlers.popular.get(function(data) {
        self.data = data.popular;
    }, function(error) {
        Utils.apiError(error.status);
    });

});

angular.module('prim').controller('NewCtrl', function(Handlers, Utils) {

    // using controllerAs
    var self = this;

    // make thumbnail source 
    self.getThumbSrc = Utils.getThumbSrc;

    // Get tag page json
    Handlers.new.get(function(data) {
        self.data = data.new;
    }, function(error) {
        Utils.apiError(error.status);
    });

});

angular.module('prim').controller('FavoritedCtrl', function(Handlers, Utils) {

    // using controllerAs
    var self = this;

    // make thumbnail source 
    self.getThumbSrc = Utils.getThumbSrc;

    // Get tag page json
    Handlers.favorited.get(function(data) {
        self.data = data.favorited;
    }, function(error) {
        Utils.apiError(error.status);
    });

});
