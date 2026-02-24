<script setup>
import { inject, onMounted, onUnmounted } from 'vue'
import drawConfig from './drawConfig'

const { canvas, selectedTool, saveState, defaultCanvas, restoreState, undoList, redoList, switchEraser } = inject('drawPad')

const toolActive = (tool) => tool === selectedTool.value

const reset = () => {
  saveState()
  localStorage.removeItem(drawConfig.storageKey)
  defaultCanvas()
}

const undo = () => restoreState(undoList, redoList)
const redo = () => restoreState(redoList, undoList)
const pencil = () => switchEraser()
const eraser = () => switchEraser(true)

const save = () => {
  const filename = new Date().getTime() + '.png'
  const link = document.createElement('a')
  link.href = canvas.value.toDataURL(drawConfig.imageMime)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const onKeyDown = (e) => {
  // Only handle when draw pad is focused/visible
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
  switch (e.key.toLowerCase()) {
    case 'p': pencil(); break
    case 'e': eraser(); break
    case 'z': undo(); break
    case 'y': redo(); break
    case 's': e.preventDefault(); save(); break
  }
}

onMounted(() => document.addEventListener('keydown', onKeyDown))
onUnmounted(() => document.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <div class="drawpad_controls">
    <button class="button" :class="{ active: toolActive(drawConfig.TOOL_PEN) }" @click="pencil" title="Pencil (P)">
      <i class="fa fa-pencil"></i>
    </button>
    <button class="button" :class="{ active: toolActive(drawConfig.TOOL_ERASER) }" @click="eraser" title="Eraser (E)">
      <i class="fa fa-eraser"></i>
    </button>
    <button class="button" @click="undo" title="Undo (Z)">
      <i class="fa fa-undo"></i>
    </button>
    <button class="button" @click="redo" title="Redo (Y)">
      <i class="fa fa-repeat"></i>
    </button>
    <button class="button" @click="reset" title="Reset">
      <i class="fa fa-trash"></i>
    </button>
    <button class="button" @click="save" title="Save (S)">
      <i class="fa fa-download"></i>
    </button>
  </div>
</template>
