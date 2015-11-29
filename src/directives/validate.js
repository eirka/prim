// this will add a custom html5 error message 
angular.module('prim').directive('validationError', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctl) {
            scope.$watch(attrs['validationError'], function(errorMsg) {
                elm[0].setCustomValidity(errorMsg);
                ctl.$setValidity('validationError', errorMsg ? false : true);
            });
        }
    };
});

// checks if a file is present
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
    }
});
