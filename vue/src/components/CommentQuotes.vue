<script setup>
import { ref } from 'vue'
import HoverBox from './HoverBox.vue'

defineProps({
  id: { type: String, required: true },
  thread: { type: Number, required: true }
})

const show = ref(false)
const toggle = () => { show.value = !show.value }
const open = () => { show.value = true }
const close = () => { show.value = false }
</script>

<template>
  <span class="quote_link">
    <a href="#" @click.prevent="toggle" @mouseenter="open" @mouseleave="close">
      &gt;&gt;{{ id }}
    </a>
    <div v-if="show" class="quote_popup">
      <HoverBox :id="id" :thread="thread" />
    </div>
  </span>
</template>
