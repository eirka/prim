// comment-handler uses a regex to parse out quotes from a post starting with >> and adds them to an array
// it then sends the generated quotes to the quotebox directive which will create a popup with the posts
// this is based on the linky filter from ngSanitize
angular.module('prim').directive('commentHandler', function() {
    return {
        restrict: 'A',
        scope: {
            post: '=',
            thread: '='
        },
        templateUrl: "pages/comment.html",
        controller: function($scope) {

            // array for comment text
            var comment = [];
            // array for quote ids
            var quotes = [];

            // matches >> with up to 5 digits
            var re = /(>>(\d{1,5}))/;
            // raw comment from json
            var raw = $scope.post.comment;
            // match from regex on comment
            var match;

            // Run regex on comment and grab matches
            while ((match = raw.match(re)) !== null) {
                // Get second group (just the post num)
                var id = match[2];
                // add quote id to id array
                quotes.push(id);

                // index of match
                var i = match.index;
                // Add non matches to html array
                comment.push(raw.substr(0, i));

                // this sets raw to the remainder text
                raw = raw.substring(i + match[0].length);
            }

            // push for final loop
            comment.push(raw);

            // this joins all the comment text sans quote ids
            $scope.post.comment = comment.join('');

            // this is all the collected quote ids
            $scope.post.quote_id = quotes;

        }
    };
});
