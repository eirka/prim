<script setup>
import { computed } from 'vue'
import CommentQuotes from './CommentQuotes.vue'
import CommentFormatter from './CommentFormatter.vue'

const props = defineProps({
  post: { type: Object, required: true },
  thread: { type: Number, required: true }
})

const quoteRegex = />>(\d{1,5})/g

const quoteIds = computed(() => {
  const quotes = []
  let m
  const re = new RegExp(quoteRegex.source, quoteRegex.flags)
  while ((m = re.exec(props.post.comment)) !== null) {
    quotes.push(m[1])
  }
  return quotes
})

const cleanComment = computed(() => {
  return props.post.comment.replace(quoteRegex, '')
})
</script>

<template>
  <div class="thread_row_post">
    <CommentQuotes
      v-for="(id, idx) in quoteIds"
      :key="idx"
      :id="id"
      :thread="thread"
      class="post_quote"
    />
    <div class="thread_comment">
      <CommentFormatter v-if="cleanComment" :comment="cleanComment" />
    </div>
  </div>
</template>
