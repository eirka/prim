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
                list.push(self.canvas.toDataURL(drawConfig.imageMime));
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
