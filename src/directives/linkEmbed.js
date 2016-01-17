// link embed template
angular.module('prim').directive('linkEmbed', function() {
    return {
        restrict: 'E',
        scope: {
            url: "@"
        },
        template: '<a ng-href="{{url}}" target="_blank" href>{{url}}</a>'
    };
});
