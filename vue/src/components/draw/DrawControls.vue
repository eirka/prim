<script setup lang="ts">
import { inject, onMounted, onUnmounted } from 'vue';
import drawConfig, { drawPadKey } from './drawConfig';
import DrawPalette from './DrawPalette.vue';

const {
  canvas,
  selectedTool,
  saveState,
  defaultCanvas,
  restoreState,
  undoList,
  redoList,
  switchEraser,
} = inject(drawPadKey)!;

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

const save = () => {
  const filename = new Date().getTime() + '.png';
  const link = document.createElement('a');
  link.href = canvas.value!.toDataURL(drawConfig.imageMime);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const onKeyDown = (e: KeyboardEvent) => {
  // Only handle when draw pad is focused/visible
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
