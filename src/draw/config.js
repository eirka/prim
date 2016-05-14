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
    imageMime: "image/png",

    // tools definitions
    TOOL_PEN: 1,
    TOOL_ERASER: 2
});
