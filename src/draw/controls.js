angular.module('prim').directive('drawControls', function(drawConfig, hotkeys) {
    return {
        restrict: 'E',
        require: '^drawPad',
        templateUrl: "pages/draw/controls.html",
        link: function(scope, element, attrs, controller) {

            // show what tool is active
            scope.toolActive = function(tool) {
                return angular.equals(tool, controller.selected_tool);
            };

            // clear the canvas to default
            scope.reset = function() {
                // save state for potential undos
                controller.saveState();
                // delete cached version
                localStorage.removeItem(drawConfig.storageKey);
                // reset to default canvas
                controller.defaultCanvas();
            };

            // undo changes
            scope.undo = function() {
                controller.restoreState(controller.undo_list, controller.redo_list);
            };

            // redo changes
            scope.redo = function() {
                controller.restoreState(controller.redo_list, controller.undo_list);
            };

            // switch to pencil
            scope.pencil = function() {
                controller.switchEraser();
            };

            // switch to eraser
            scope.eraser = function() {
                controller.switchEraser(true);
            };

            // download current canvas
            scope.save = function() {
                // filename with unix timestamp
                var filename = new Date().getTime() + '.png';
                // this basically creates a link and clicks it ;D
                var link = document.createElement('a');
                link.href = controller.canvas.toDataURL(drawConfig.imageMime);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
            };

            // keyboard controls
            hotkeys.bindTo(scope)
                .add({
                    combo: 'p',
                    description: 'Pencil',
                    callback: function() {
                        scope.pencil();
                    }
                })
                .add({
                    combo: 'e',
                    description: 'Eraser',
                    callback: function() {
                        scope.eraser();
                    }
                })
                .add({
                    combo: 'z',
                    description: 'Undo',
                    callback: function() {
                        scope.undo();
                    }
                })
                .add({
                    combo: 'y',
                    description: 'Redo',
                    callback: function() {
                        scope.redo();
                    }
                })
                .add({
                    combo: 's',
                    description: 'Save',
                    callback: function() {
                        scope.save();
                    }
                });

        }
    };
});
