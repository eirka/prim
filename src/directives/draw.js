angular.module('prim').constant('drawConfig', {
    // options
    drawControls: true,
    width: 500,
    height: 500,
    canvasColor: "#fff",
    lineColor: "#000000",
    lineWidth: 1,
    undoLength: 30,
    storageKey: "lineWriterCache",

    // tools definitions
    TOOL_PEN: 1,
    TOOL_ERASER: 2
});

angular.module('prim').directive('drawPad', function(drawConfig) {
    return {
        restrict: 'E',
        templateUrl: "pages/draw/pad.html",
        scope: {
            toggle: '=',
            visible: '='
        },
        controllerAs: 'draw',
        bindToController: true,
        controller: function() {

            // using controllerAs
            var self = this;

            // to hold our redo and undo data
            self.redo_list = [];
            self.undo_list = [];

            // current selected tool
            self.selected_tool = drawConfig.TOOL_PEN;
            // current selected color
            self.selected_color = drawConfig.lineColor;
            // selected line width
            self.line_width = drawConfig.lineWidth;

            // if we should show the controls
            self.showControls = drawConfig.drawControls;

            // will add the canvas context to the scope
            self.addCanvas = function(canvas) {
                if (angular.isElement(canvas)) {
                    self.canvas = canvas;
                    // get canvas context
                    self.ctx = canvas.getContext('2d');
                }
            };

            // the default canvas settings
            self.defaultCanvas = function() {
                if (angular.isDefined(self.ctx)) {
                    // default fill color
                    self.ctx.fillStyle = drawConfig.canvasColor;
                    // default tool
                    self.selected_tool = drawConfig.TOOL_PEN;
                    // default stroke color
                    self.ctx.strokeStyle = drawConfig.lineColor;
                    // reset selected color
                    self.selected_color = drawConfig.lineColor;
                    // default line width
                    self.ctx.lineWidth = drawConfig.lineWidth;
                    // create clear canvas
                    self.ctx.fillRect(0, 0, drawConfig.width, drawConfig.height);
                }
            };

            // save the current canvas and add to redo list
            self.saveState = function(list, keep) {
                // optionally clear redo list
                keep = keep || false;
                if (!keep) {
                    self.redo_list = [];
                }

                // if list isnt set then default to undo
                list = (list || self.undo_list);

                // clear max items
                while (list.length > drawConfig.undoLength) {
                    console.log("clearing max items!");
                    list.shift();
                }

                // push canvas to undo list or specified list
                list.push(self.canvas.toDataURL('image/png'));
            };

            // restore a saved image state
            self.restoreState = function(pop, push) {
                if (pop.length) {
                    // push to list for redo
                    this.saveState(push, true);

                    // get the last state from the list
                    var restore_state = pop.pop();

                    // new img element from history
                    var img = new Image();
                    img.src = restore_state;

                    // replace canvas with image
                    img.onload = function() {
                        self.ctx.clearRect(0, 0, drawConfig.width, drawConfig.height);
                        self.ctx.drawImage(img, 0, 0, drawConfig.width, drawConfig.height);
                    };

                }
            };

            // switch stroke color to background for eraser
            self.switchEraser = function(eraser) {
                if (eraser) {
                    self.selected_tool = drawConfig.TOOL_ERASER;
                    self.ctx.strokeStyle = drawConfig.canvasColor;
                    self.ctx.lineWidth = 30;
                    return;
                }
                self.selected_tool = drawConfig.TOOL_PEN;
                self.ctx.strokeStyle = self.selected_color;
                self.ctx.lineWidth = self.line_width;
            };

        }
    };
});

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
                link.href = controller.canvas.toDataURL('image/png');
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
                    localStorage.setItem(drawConfig.storageKey, canvas.toDataURL('image/png'));
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
