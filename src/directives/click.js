// calls function if you click anywhere else
angular.module('prim').directive('clickOff', function($document) {
    return {
        restrict: 'A',
        scope: {
            callback: '=clickOff'
        },
        link: function(scope, element) {

            // apply the events to the scope
            var handler = function(event) {
                if (!element[0].contains(event.target)) {
                    scope.$applyAsync(function() {
                        scope.callback();
                    });
                }
            };

            // watch for click and touchstart events
            $document.on('click', handler);
            $document.on('touchstart', handler);

            // when the element is destroyed turn the watchers off
            scope.$on('$destroy', function() {
                $document.off('click', handler);
                $document.off('touchstart', handler);
            });

        }
    };
});
