// quotebox takes the quotes from comment-handler and makes a popup box with the post data
angular.module('prim').directive('commentQuotes', function() {
    return {
        restrict: 'E',
        scope: {
            id: '=',
            thread: '='
        },
        templateUrl: "pages/hover.html",
        link: function(scope) {

            // Hoverbox code
            scope.show = false;

            // toggle menu visibility
            scope.toggle = function() {
                scope.show = !scope.show;
            };

            scope.open = function() {
                scope.show = true;
            };

            scope.close = function() {
                scope.show = false;
            };

        }
    };
});


// quotebox takes the quotes from comment-handler and makes a popup box with the post data
angular.module('prim').directive('hoverBox', function(Handlers, Utils) {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: "pages/box.html",
        link: function(scope) {

            // selects usergroup class
            scope.usergroupClass = Utils.usergroupClass;

            // get avatar
            scope.getAvatar = Utils.getAvatar;

            // make thumbnail source 
            scope.getThumbSrc = Utils.getThumbSrc;

            Handlers.post.get({
                thread: scope.thread,
                id: scope.id
            }, function(data) {
                scope.quotebox = data;
            }, function(error) {
                scope.error = error.data;
            });

        }
    };
});
