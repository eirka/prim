// comment-handler uses a regex to parse out quotes from a post starting with >> and adds them to an array
// it then sends the generated quotes to the quotebox directive which will create a popup with the posts
angular.module('prim').directive('commentHandler', function() {
    return {
        restrict: 'A',
        scope: {
            post: '=',
            thread: '='
        },
        templateUrl: "pages/comment.html",
        controller: function($scope) {
            // Match quote format
            var re = /(>>(\d{1,5}))/;
            var raw = $scope.post.comment;
            var html = [];
            var id = [];
            var match;

            function addText(text) {
                html.push(text);
            }

            // makes a link
            function addLink(url) {
                id.push(url);
            }

            // Run regex on comment and grab matches
            while (match = raw.match(re)) {
                // Get second group (just the post num)
                var url = match[2];
                var i = match.index;
                // Add non matches to html array
                addText(raw.substr(0, i));
                // Create link with matches
                addLink(url, match[0]);
                raw = raw.substring(i + match[0].length);
            }

            addText(raw);
            // join the html array and sanitize
            $scope.post.comment = html.join('');
            // add post num to scope
            $scope.post.quote_id = id;

        }
    };
});
