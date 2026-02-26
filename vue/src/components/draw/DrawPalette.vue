<script setup lang="ts">
import { ref, inject } from 'vue'
import { drawPadKey } from './drawConfig'

const { switchEraser, selectedColor, lineWidth, ctx } = inject(drawPadKey)!

const paletteVisible = ref(false)
const togglePalette = () => { paletteVisible.value = !paletteVisible.value }

const colorRows = [
  {
    size: 1,
    dotSize: '2px',
    colors: ['#FFFFFF', '#F0F0F0', '#C8C8C8', '#B4B4B4', '#A0A0A0', '#8A8A8A', '#757575', '#606060', '#4B4B4B', '#363636', '#2A2A2A', '#000000']
  },
  {
    size: 2,
    dotSize: '4px',
    colors: ['#FF7FFE', '#FF7FBF', '#FF7F7F', '#FFBF7F', '#FEFF7F', '#BFFF7F', '#7FFF7F', '#7FFFBF', '#7FFEFF', '#7FBFFF', '#7F7FFF', '#BF7FFF']
  },
  {
    size: 3,
    dotSize: '6px',
    colors: ['#FF00FE', '#FF007F', '#FF0000', '#FF7F00', '#FEFF00', '#7FFF00', '#00FF00', '#00FF7F', '#00FEFF', '#007FFF', '#0000FF', '#7F00FF']
  },
  {
    size: 4,
    dotSize: '8px',
    colors: ['#7F007F', '#7F003F', '#7F0000', '#7F3F00', '#7F7F00', '#3F7F00', '#007F00', '#007F3F', '#007F7F', '#003F7F', '#00007F', '#3F007F']
  }
]

const setColor = (color: string) => {
  switchEraser()
  selectedColor.value = color
  ctx.value!.strokeStyle = color
}

const setSize = (size: number) => {
  switchEraser()
  lineWidth.value = size
  ctx.value!.lineWidth = size
}
</script>

<template>
  <div class="color-control" :style="{ background: selectedColor }" @click="togglePalette">
    <div v-if="paletteVisible" class="color-palette">
      <div v-for="(row, i) in colorRows" :key="i" class="color-bar">
        <div class="size-option" @click.stop="setSize(row.size)">
          <span :style="{ background: selectedColor, width: row.dotSize, height: row.dotSize, borderRadius: row.dotSize }"></span>
        </div>
        <div
          v-for="color in row.colors"
          :key="color"
          class="color-option"
          :style="{ background: color }"
          @click.stop="setColor(color)"
        ></div>
      </div>
    </div>
  </div>
</template>
