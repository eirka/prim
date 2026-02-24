<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

const checkScroll = () => {
  visible.value = window.pageYOffset > 300
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', checkScroll))
onUnmounted(() => window.removeEventListener('scroll', checkScroll))
</script>

<template>
  <div v-if="visible" class="scrolltotop" @click="scrollToTop">
    <i class="fa fa-arrow-up"></i>
  </div>
</template>
