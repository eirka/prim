angular.module('prim').directive('drawPalette', function() {
    return {
        restrict: 'E',
        require: '^drawPad',
        templateUrl: "pages/draw/palette.html",
        link: function(scope, element, attrs, controller) {

            scope.paletteVisible = false;

            // toggle menu visibility
            scope.paletteToggle = function() {
                scope.paletteVisible = !scope.paletteVisible;
            };

            scope.paletteOpen = function() {
                scope.paletteVisible = true;
            };

            scope.paletteClose = function() {
                scope.paletteVisible = false;
            };

            // set the stroke color
            scope.setColor = function(color) {
                controller.switchEraser();
                controller.selected_color = color;
                controller.ctx.strokeStyle = color;
            };

            // set the line width
            scope.setSize = function(size) {
                controller.switchEraser();
                controller.line_width = size;
                controller.ctx.lineWidth = size;
            };

        }
    };
});
