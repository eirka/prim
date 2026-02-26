<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { buildCommentDom } from '@/composables/useCommentDom'

const props = defineProps<{
  comment: string
}>()

const container = ref<HTMLParagraphElement | null>(null)

onMounted(() => {
  if (container.value) buildCommentDom(container.value, props.comment)
})

watch(() => props.comment, (val) => {
  if (container.value) buildCommentDom(container.value, val)
})
</script>

<template>
  <p ref="container"></p>
</template>
