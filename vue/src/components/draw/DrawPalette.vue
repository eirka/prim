<script setup>
import { ref, inject } from 'vue'

const { switchEraser, selectedColor, lineWidth, ctx } = inject('drawPad')

const paletteVisible = ref(false)
const togglePalette = () => { paletteVisible.value = !paletteVisible.value }

const colors = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff',
  '#888888', '#444444', '#884400', '#ff6688', '#88ff66'
]

const sizes = [1, 2, 4, 8, 16]

const setColor = (color) => {
  switchEraser()
  selectedColor.value = color
  ctx.value.strokeStyle = color
}

const setSize = (size) => {
  switchEraser()
  lineWidth.value = size
  ctx.value.lineWidth = size
}
</script>

<template>
  <div class="drawpad_palette">
    <button class="button" @click="togglePalette" title="Palette">
      <i class="fa fa-paint-brush"></i>
    </button>
    <div v-if="paletteVisible" class="palette_popup">
      <div class="palette_colors">
        <button
          v-for="color in colors"
          :key="color"
          class="palette_swatch"
          :style="{ backgroundColor: color }"
          :class="{ active: selectedColor === color }"
          @click="setColor(color)"
        ></button>
      </div>
      <div class="palette_sizes">
        <button
          v-for="size in sizes"
          :key="size"
          class="button"
          :class="{ active: lineWidth === size }"
          @click="setSize(size)"
        >{{ size }}px</button>
      </div>
    </div>
  </div>
</template>
