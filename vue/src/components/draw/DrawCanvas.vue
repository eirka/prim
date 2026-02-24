<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'
import drawConfig from './drawConfig'

const { addCanvas, ctx, saveState, defaultCanvas } = inject('drawPad')
const canvasRef = ref(null)
let drawing = false

onMounted(() => {
  const canvas = canvasRef.value
  canvas.width = drawConfig.width
  canvas.height = drawConfig.height

  addCanvas(canvas)

  // Restore cached canvas
  const cached = localStorage.getItem(drawConfig.storageKey)
  if (cached) {
    const img = new Image()
    img.src = cached
    img.onload = () => {
      ctx.value.clearRect(0, 0, drawConfig.width, drawConfig.height)
      ctx.value.drawImage(img, 0, 0, drawConfig.width, drawConfig.height)
    }
  } else {
    defaultCanvas()
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  document.addEventListener('touchmove', onMouseMove)
  document.addEventListener('touchend', onMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
  document.removeEventListener('touchmove', onMouseMove)
  document.removeEventListener('touchend', onMouseUp)
})

const onMouseDown = (event) => {
  event.preventDefault()
  event.stopPropagation()
  drawing = true
  saveState()
  ctx.value.lineJoin = 'round'
  ctx.value.lineCap = 'round'
  ctx.value.beginPath()
  ctx.value.moveTo(event.offsetX, event.offsetY)
}

const onMouseMove = (event) => {
  if (!drawing) return
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  ctx.value.lineTo(
    Math.floor(event.pageX - rect.left),
    Math.floor(event.pageY - rect.top)
  )
  ctx.value.stroke()
}

const onMouseUp = () => {
  if (!drawing) return
  drawing = false
  ctx.value.closePath()
  localStorage.setItem(drawConfig.storageKey, canvasRef.value.toDataURL(drawConfig.imageMime))
}
</script>

<template>
  <div class="drawpad_canvas">
    <canvas
      ref="canvasRef"
      @mousedown="onMouseDown"
      @touchstart="onMouseDown"
    ></canvas>
  </div>
</template>
