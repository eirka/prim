// essentially the controller for the comment popup
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
