angular.module('prim').controller('PopularCtrl', function(PopularHandler, Utils) {

    // using controllerAs
    var self = this;

    // Get tag page json
    PopularHandler.get(function(data) {
        self.data = data.popular;

        // modify content
        angular.forEach(self.data, function(image) {
            image.thumbnail = Utils.getThumbSrc(image.thumbnail, image.filename);
        });

    }, function(error) {
        Utils.apiError(error.status);
    });

});

angular.module('prim').controller('NewCtrl', function(NewHandler, Utils) {

    // using controllerAs
    var self = this;

    // Get tag page json
    NewHandler.get(function(data) {
        self.data = data.new;

        // modify content
        angular.forEach(self.data, function(image) {
            image.thumbnail = Utils.getThumbSrc(image.thumbnail, image.filename);
        });

    }, function(error) {
        Utils.apiError(error.status);
    });

});

angular.module('prim').controller('FavoritedCtrl', function(FavoritedHandler, Utils) {

    // using controllerAs
    var self = this;

    // Get tag page json
    FavoritedHandler.get(function(data) {
        self.data = data.favorited;

        // modify content
        angular.forEach(self.data, function(image) {
            image.thumbnail = Utils.getThumbSrc(image.thumbnail, image.filename);
        });

    }, function(error) {
        Utils.apiError(error.status);
    });

});
