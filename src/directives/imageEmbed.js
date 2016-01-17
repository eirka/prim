// image embed template
angular.module('prim').directive('imageEmbed', function() {
    return {
        restrict: 'E',
        scope: {
            url: "@"
        },
        template: '<a ng-href="{{url}}" target="_blank" href><img class="external_image" ng-src="{{url}}" /></a>'
    };
});
