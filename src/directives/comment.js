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
            var re = /(>>(\d{1,4}))/;
            var raw = $scope.post.comment;
            var html = [];
            var id = [];
            var match;

            function addText(text) {
                html.push(text);
            }

            // makes a link
            function addLink(url) {
                //link.push('<a href="post/' + $scope.thread.id + '/' + url + '">' + text + '</a> ');
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
            // add link to scope
            //$scope.post.quote_link = link;
            // add post num to scope
            $scope.post.quote_id = id;

        }
    };
});
