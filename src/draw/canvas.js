angular.module('prim').directive('drawCanvas', function($document, drawConfig) {
    return {
        restrict: 'E',
        require: '^drawPad',
        templateUrl: "pages/draw/canvas.html",
        link: function(scope, element, attrs, controller) {

            var canvas = element.find('canvas')[0];

            // set width and height
            canvas.width = drawConfig.width;
            canvas.height = drawConfig.height;

            // add the canvas to the parent controller
            controller.addCanvas(canvas);

            // try and get cached canvas
            if (!angular.equals(localStorage.getItem(drawConfig.storageKey), null)) {
                // new img element from history
                var img = new Image();
                img.src = localStorage.getItem(drawConfig.storageKey);

                // replace canvas with image
                img.onload = function() {
                    controller.ctx.clearRect(0, 0, drawConfig.width, drawConfig.height);
                    controller.ctx.drawImage(img, 0, 0, drawConfig.width, drawConfig.height);
                };
            } else {
                // set the default canvas settings
                controller.defaultCanvas();
            }

            // variable that decides if something should be drawn on mousemove
            var drawing = false;

            element.bind('mousedown', function(event) {
                event.preventDefault();
                event.stopPropagation();

                drawing = true;

                // save the current canvas for undo/redo
                controller.saveState();

                controller.ctx.lineJoin = 'round';
                controller.ctx.lineCap = 'round';
                controller.ctx.beginPath();
                controller.ctx.moveTo(event.offsetX, event.offsetY);

            });

            $document.on('mousemove', function(event) {
                if (drawing) {
                    var canvasOffset = canvas.getBoundingClientRect();
                    controller.ctx.lineTo(Math.floor(event.pageX - canvasOffset.left), Math.floor(event.pageY - canvasOffset.top));
                    controller.ctx.stroke();
                }
            });

            $document.on('mouseup', function() {
                if (drawing) {
                    drawing = false;
                    controller.ctx.closePath();
                    // save the current state in localstorage cache
                    localStorage.setItem(drawConfig.storageKey, canvas.toDataURL(drawConfig.imageMime));
                }
            });

            // remove watcher on destroy
            scope.$on('$destroy', function() {
                $document.off('mousemove');
                $document.off('mouseup');
            });

        }
    };
});
