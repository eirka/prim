// youtube embed template
angular.module('prim').directive('youtubeEmbed', function($sce) {
    return {
        restrict: 'E',
        scope: {
            url: "@"
        },
        template: '<div class="auto-resizable-iframe"><div><iframe ng-src="{{video}}" frameborder="0" allowfullscreen></iframe></div></div>',
        link: function(scope) {

            // create video link
            scope.video = $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + scope.url);

        }
    };
});
