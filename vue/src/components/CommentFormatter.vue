<script setup>
import { ref, onMounted, watch } from 'vue'
import { buildCommentDom } from '@/composables/useCommentDom'

const props = defineProps({
  comment: { type: String, required: true }
})

const container = ref(null)

onMounted(() => buildCommentDom(container.value, props.comment))

watch(() => props.comment, (val) => {
  if (container.value) buildCommentDom(container.value, val)
})
</script>

<template>
  <p ref="container"></p>
</template>
