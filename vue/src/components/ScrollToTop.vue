<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const visible = ref(false);

const checkScroll = () => {
  visible.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => window.addEventListener('scroll', checkScroll, { passive: true }));
onUnmounted(() => window.removeEventListener('scroll', checkScroll));
</script>

<template>
  <div
    class="prim-totop fa fa-fw fa-arrow-up fa-3x"
    :class="{ toTopActive: visible }"
    @click="scrollToTop"
  ></div>
</template>
