// TrendingCtrl is the controller for the trending page
angular.module('prim').controller('TrendingCtrl', function(popular, newest, favorited, Handlers, Utils) {

    // using controllerAs
    var self = this;

    // make thumbnail source 
    self.getThumbSrc = Utils.getThumbSrc;

    if (angular.isDefined(popular)) {
        self.popular = popular.popular;
    }

    if (angular.isDefined(newest)) {
        self.newest = newest.new;
    }

    if (angular.isDefined(favorited)) {
        self.favorited = favorited.favorited;
    }

});
