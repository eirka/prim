angular.module('prim').controller('PopularCtrl', function(Handlers, Utils) {

    // using controllerAs
    var self = this;

    // Get tag page json
    Handlers.popular.get(function(data) {
        self.data = data.popular;

        // modify content
        angular.forEach(self.data, function(image) {
            image.thumbnail = Utils.getThumbSrc(image.thumbnail, image.filename);
        });

    }, function(error) {
        Utils.apiError(error.status);
    });

});

angular.module('prim').controller('NewCtrl', function(Handlers, Utils) {

    // using controllerAs
    var self = this;

    // Get tag page json
    Handlers.new.get(function(data) {
        self.data = data.new;

        // modify content
        angular.forEach(self.data, function(image) {
            image.thumbnail = Utils.getThumbSrc(image.thumbnail, image.filename);
        });

    }, function(error) {
        Utils.apiError(error.status);
    });

});

angular.module('prim').controller('FavoritedCtrl', function(Handlers, Utils) {

    // using controllerAs
    var self = this;

    // Get tag page json
    Handlers.favorited.get(function(data) {
        self.data = data.favorited;

        // modify content
        angular.forEach(self.data, function(image) {
            image.thumbnail = Utils.getThumbSrc(image.thumbnail, image.filename);
        });

    }, function(error) {
        Utils.apiError(error.status);
    });

});
