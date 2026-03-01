<script setup lang="ts">
import { ref, inject, onMounted, onUnmounted } from 'vue';
import drawConfig, { drawPadKey } from './drawConfig';

const drawPad = inject(drawPadKey);
if (!drawPad) throw new Error('DrawCanvas must be used inside DrawPad');
const { addCanvas, ctx, saveState, defaultCanvas } = drawPad;
const canvasRef = ref<HTMLCanvasElement | null>(null);
let drawing = false;

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  canvas.width = drawConfig.width;
  canvas.height = drawConfig.height;

  addCanvas(canvas);

  // Restore cached canvas
  const cached = localStorage.getItem(drawConfig.storageKey);
  if (cached) {
    const img = new Image();
    img.src = cached;
    img.onload = () => {
      if (!ctx.value) return;
      ctx.value.clearRect(0, 0, drawConfig.width, drawConfig.height);
      ctx.value.drawImage(img, 0, 0, drawConfig.width, drawConfig.height);
    };
  } else {
    defaultCanvas();
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('touchmove', onMouseMove);
  document.addEventListener('touchend', onMouseUp);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
  document.removeEventListener('touchmove', onMouseMove);
  document.removeEventListener('touchend', onMouseUp);
});

const getCoords = (event: MouseEvent | TouchEvent, rect: DOMRect) => {
  if ('touches' in event) {
    const touch = event.touches[0];
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  }
  return {
    x: (event as MouseEvent).clientX - rect.left,
    y: (event as MouseEvent).clientY - rect.top,
  };
};

const onMouseDown = (event: MouseEvent | TouchEvent) => {
  event.preventDefault();
  event.stopPropagation();
  drawing = true;
  saveState();
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const { x, y } = getCoords(event, rect);
  if (ctx.value) {
    ctx.value.lineJoin = 'round';
    ctx.value.lineCap = 'round';
    ctx.value.beginPath();
    ctx.value.moveTo(x, y);
  }
};

const onMouseMove = (event: MouseEvent | TouchEvent) => {
  if (!drawing || !canvasRef.value || !ctx.value) return;
  const canvas = canvasRef.value;
  const rect = canvas.getBoundingClientRect();
  const { x, y } = getCoords(event, rect);
  ctx.value.lineTo(Math.floor(x), Math.floor(y));
  ctx.value.stroke();
};

const onMouseUp = () => {
  if (!drawing || !ctx.value || !canvasRef.value) return;
  drawing = false;
  ctx.value.closePath();
  localStorage.setItem(drawConfig.storageKey, canvasRef.value.toDataURL(drawConfig.imageMime));
};
</script>

<template>
  <div class="draw-canvas">
    <canvas
      class="canvas-element"
      ref="canvasRef"
      @mousedown="onMouseDown"
      @touchstart="onMouseDown"
    ></canvas>
  </div>
</template>
