// calls function if you click anywhere else
angular.module('prim').directive('clickOff', function($document) {
    return {
        restrict: 'A',
        scope: {
            callback: '=clickOff'
        },
        link: function(scope, element) {

            var handler = function(event) {
                if (!element[0].contains(event.target)) {
                    scope.$applyAsync(function() {
                        scope.callback();
                    });
                }
            };

            $document.on('click', handler);
            $document.on('touchstart', handler);

            scope.$on('$destroy', function() {
                $document.off('click', handler);
                $document.off('touchstart', handler);
            });

        }
    };
});
