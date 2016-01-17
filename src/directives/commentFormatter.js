// formats the comment text with emoticons and embeds
angular.module('prim').directive('commentFormatter', function($sanitize, $compile, embed, emoticons) {
    return {
        restrict: 'E',
        scope: {
            comment: '='
        },
        link: function(scope, element) {

            var comment = scope.comment;

            // trim and remove extra newlines
            comment = comment.replace(/(\n){3,}/g, '\n\n').trim();

            // filter comment and add embeds
            comment = embed.filterComment(comment);

            // add emoticons
            comment = emoticons.injectTags(comment);

            element.html('<p>' + comment + '</p>');

            // compile our comment and add it to dom
            $compile(element.contents())(scope);

        }
    };
});
