<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import ScrollToTop from '@/components/ScrollToTop.vue'

const route = useRoute()
</script>

<template>
  <LoadingIndicator />
  <ScrollToTop />
  <AppHeader />
  <router-view :key="route.fullPath" />
</template>
