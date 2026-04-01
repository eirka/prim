<script setup lang="ts">
import { inject, onMounted, onUnmounted } from 'vue';
import DrawPalette from './DrawPalette.vue';
import drawConfig, { drawPadKey } from './drawConfig';

const drawPad = inject(drawPadKey);
if (!drawPad) throw new Error('DrawControls must be used inside DrawPad');
const {
  canvas,
  selectedTool,
  saveState,
  defaultCanvas,
  restoreState,
  undoList,
  redoList,
  switchEraser,
} = drawPad;

const toolActive = (tool: number) => tool === selectedTool.value;

const reset = () => {
  saveState();
  localStorage.removeItem(drawConfig.storageKey);
  defaultCanvas();
};

const undo = () => restoreState(undoList, redoList);
const redo = () => restoreState(redoList, undoList);
const pencil = () => switchEraser();
const eraser = () => switchEraser(true);

// Downloads the canvas as a PNG file. Creates a temporary anchor element with
// the canvas data URL as href, simulates a click to trigger download, then
// removes the anchor from the DOM.
const save = () => {
  if (!canvas.value) return;
  const filename = `${Date.now()}.png`;
  const link = document.createElement('a');
  link.href = canvas.value.toDataURL(drawConfig.imageMime);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Global keyboard shortcuts for the drawing pad (p=pencil, e=eraser, z=undo,
// y=redo, s=save). Skips handling when focus is in an input/textarea to avoid
// intercepting normal typing.
const onKeyDown = (e: KeyboardEvent) => {
  if (
    (e.target as HTMLElement).tagName === 'INPUT' ||
    (e.target as HTMLElement).tagName === 'TEXTAREA'
  )
    return;
  switch (e.key.toLowerCase()) {
    case 'p':
      pencil();
      break;
    case 'e':
      eraser();
      break;
    case 'z':
      undo();
      break;
    case 'y':
      redo();
      break;
    case 's':
      e.preventDefault();
      save();
      break;
  }
};

onMounted(() => document.addEventListener('keydown', onKeyDown));
onUnmounted(() => document.removeEventListener('keydown', onKeyDown));
</script>

<template>
  <div class="draw-controls">
    <DrawPalette />
    <button :class="{ active: toolActive(drawConfig.TOOL_PEN) }" @click="pencil">Draw</button>
    <button :class="{ active: toolActive(drawConfig.TOOL_ERASER) }" @click="eraser">Erase</button>
    <button @click="undo">Undo</button>
    <button @click="redo">Redo</button>
    <button @click="reset">Clear</button>
    <button @click="save">Save</button>
  </div>
</template>
