<script setup lang="ts">
import { computed } from 'vue';
import type { Post } from '@/types';
import CommentFormatter from './CommentFormatter.vue';
import CommentQuotes from './CommentQuotes.vue';

const props = defineProps<{
  post: Post;
  thread: number;
}>();

const quoteRegex = />>(\d{1,5})/g;

const quoteIds = computed(() => {
  const quotes: number[] = [];
  let m: RegExpExecArray | null;
  const re = new RegExp(quoteRegex.source, quoteRegex.flags);
  while ((m = re.exec(props.post.comment)) !== null) {
    quotes.push(Number(m[1]));
  }
  return quotes;
});

const cleanComment = computed(() => {
  return props.post.comment.replace(new RegExp(quoteRegex.source, quoteRegex.flags), '');
});
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
