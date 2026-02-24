<script setup>
import AppHeader from '@/components/AppHeader.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import ScrollToTop from '@/components/ScrollToTop.vue'
</script>

<template>
  <LoadingIndicator />
  <ScrollToTop />
  <AppHeader />
  <router-view />
</template>
