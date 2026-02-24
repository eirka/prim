<script setup>
import { ref, provide, reactive } from 'vue'
import drawConfig from './drawConfig'
import DrawCanvas from './DrawCanvas.vue'
import DrawControls from './DrawControls.vue'
import DrawPalette from './DrawPalette.vue'

const props = defineProps({
  visible: { type: Boolean, default: false }
})
const emit = defineEmits(['toggle'])

const canvas = ref(null)
const ctx = ref(null)
const redoList = reactive([])
const undoList = reactive([])
const selectedTool = ref(drawConfig.TOOL_PEN)
const selectedColor = ref(drawConfig.lineColor)
const lineWidth = ref(drawConfig.lineWidth)

const addCanvas = (canvasEl) => {
  canvas.value = canvasEl
  ctx.value = canvasEl.getContext('2d')
}

const defaultCanvas = () => {
  if (!ctx.value) return
  ctx.value.fillStyle = drawConfig.canvasColor
  selectedTool.value = drawConfig.TOOL_PEN
  ctx.value.strokeStyle = drawConfig.lineColor
  selectedColor.value = drawConfig.lineColor
  ctx.value.lineWidth = drawConfig.lineWidth
  ctx.value.fillRect(0, 0, drawConfig.width, drawConfig.height)
}

const saveState = (list, keep) => {
  keep = keep || false
  if (!keep) redoList.length = 0
  const target = list || undoList
  while (target.length > drawConfig.undoLength) target.shift()
  target.push(canvas.value.toDataURL(drawConfig.imageMime))
}

const restoreState = (pop, push) => {
  if (!pop.length) return
  saveState(push, true)
  const restoreData = pop.pop()
  const img = new Image()
  img.src = restoreData
  img.onload = () => {
    ctx.value.clearRect(0, 0, drawConfig.width, drawConfig.height)
    ctx.value.drawImage(img, 0, 0, drawConfig.width, drawConfig.height)
  }
}

const switchEraser = (eraser) => {
  if (eraser) {
    selectedTool.value = drawConfig.TOOL_ERASER
    ctx.value.strokeStyle = drawConfig.canvasColor
    ctx.value.lineWidth = 30
    return
  }
  selectedTool.value = drawConfig.TOOL_PEN
  ctx.value.strokeStyle = selectedColor.value
  ctx.value.lineWidth = lineWidth.value
}

provide('drawPad', {
  canvas, ctx, redoList, undoList,
  selectedTool, selectedColor, lineWidth,
  addCanvas, defaultCanvas, saveState, restoreState, switchEraser
})
</script>

<template>
  <div v-if="visible" class="drawpad">
    <div class="drawpad_header">
      <span>Drawing Pad</span>
      <button class="button button-primary" @click="emit('toggle')">Close</button>
    </div>
    <div class="drawpad_container">
      <DrawCanvas />
      <DrawControls v-if="drawConfig.drawControls" />
      <DrawPalette />
    </div>
  </div>
</template>
