<script setup lang="ts">
import { ref, provide, reactive } from 'vue'
import drawConfig, { drawPadKey } from './drawConfig'
import DrawCanvas from './DrawCanvas.vue'
import DrawControls from './DrawControls.vue'

defineProps<{
  visible: boolean
}>()
const emit = defineEmits<{
  toggle: []
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const redoList = reactive<string[]>([])
const undoList = reactive<string[]>([])
const selectedTool = ref(drawConfig.TOOL_PEN)
const selectedColor = ref(drawConfig.lineColor)
const lineWidth = ref(drawConfig.lineWidth)

const addCanvas = (canvasEl: HTMLCanvasElement) => {
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

const saveState = (list?: string[], keep?: boolean) => {
  if (!canvas.value) return
  keep = keep || false
  if (!keep) redoList.length = 0
  const target = list || undoList
  while (target.length > drawConfig.undoLength) target.shift()
  target.push(canvas.value.toDataURL(drawConfig.imageMime))
}

const restoreState = (pop: string[], push: string[]) => {
  if (!pop.length || !ctx.value) return
  saveState(push, true)
  const restoreData = pop.pop()!
  const img = new Image()
  img.src = restoreData
  img.onload = () => {
    if (!ctx.value) return
    ctx.value.clearRect(0, 0, drawConfig.width, drawConfig.height)
    ctx.value.drawImage(img, 0, 0, drawConfig.width, drawConfig.height)
  }
}

const switchEraser = (eraser?: boolean) => {
  if (!ctx.value) return
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

provide(drawPadKey, {
  canvas, ctx, redoList, undoList,
  selectedTool, selectedColor, lineWidth,
  addCanvas, defaultCanvas, saveState, restoreState, switchEraser
})
</script>

<template>
  <div v-if="visible" class="draw-pad">
    <div class="draw-title">
      <span><em>LineWriter 95</em></span>
      <a href="#" @click.prevent="emit('toggle')" class="fa fa-times close"></a>
    </div>
    <DrawControls v-if="drawConfig.drawControls" />
    <DrawCanvas />
  </div>
</template>
