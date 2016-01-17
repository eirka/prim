// checks if a file is present because the angular validate directives dont work on a file
angular.module('prim').directive('validateFile', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, el, attrs, ngModel) {
            //change event is fired when file is selected
            el.bind('change', function() {
                scope.$apply(function() {
                    ngModel.$setViewValue(el.val());
                    ngModel.$render();
                });
            });
        }
    };
});
