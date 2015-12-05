// quotebox takes the quotes from comment-handler and makes a popup box with the post data
angular.module('prim').directive('commentQuotes', function() {
    return {
        restrict: 'E',
        scope: {
            id: '=',
            thread: '='
        },
        templateUrl: "pages/hover.html",
        link: function(scope, element, attrs) {

            // Hoverbox code
            scope.show = false;

            // toggle menu visibility
            scope.toggle = function() {
                scope.show = !scope.show;
            }

            scope.open = function() {
                scope.show = true;
            }

            scope.close = function() {
                scope.show = false;
            }

        }
    };
});


// quotebox takes the quotes from comment-handler and makes a popup box with the post data
angular.module('prim').directive('hoverBox', function(Handlers, Utils) {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: "pages/box.html",
        link: function(scope, element, attrs) {

            // selects usergroup class
            scope.usergroupClass = Utils.usergroupClass;

            Handlers.post.get({
                thread: scope.thread,
                id: scope.id
            }, function(data) {

                scope.quotebox = data;

                scope.quotebox.post.avatar = Utils.getAvatar(data.post.avatar);

                // set thumbnail
                if (angular.isDefined(data.post.thumbnail)) {
                    scope.quotebox.post.thumbnail = Utils.getThumbSrc(data.post.thumbnail, data.post.filename);
                }

            }, function(error) {
                scope.error = error.data;
            });

        }
    };
});
