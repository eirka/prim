<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const loading = ref(false)
const router = useRouter()

router.beforeEach(() => { loading.value = true })
router.afterEach(() => { loading.value = false })
router.onError(() => { loading.value = false })
</script>

<template>
  <div v-if="loading" class="loading-indicator">
    <div class="loading-spinner"></div>
  </div>
</template>
