<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalItems: number
  itemsPerPage: number
  maxSize?: number
}>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

const pages = computed(() => {
  const total = totalPages.value
  const current = props.currentPage
  const max = props.maxSize ?? 5
  let start = Math.max(1, current - Math.floor(max / 2))
  let end = start + max - 1
  if (end > total) {
    end = total
    start = Math.max(1, end - max + 1)
  }
  const result: number[] = []
  for (let i = start; i <= end; i++) result.push(i)
  return result
})

const setPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('update:currentPage', page)
  }
}
</script>

<template>
  <ul v-if="totalPages > 1" class="pagination">
    <li :class="{ disabled: currentPage === 1 }">
      <a href="#" @click.prevent="setPage(1)">&laquo;</a>
    </li>
    <li v-for="page in pages" :key="page" :class="{ active: page === currentPage }">
      <a href="#" @click.prevent="setPage(page)">{{ page }}</a>
    </li>
    <li :class="{ disabled: currentPage === totalPages }">
      <a href="#" @click.prevent="setPage(totalPages)">&raquo;</a>
    </li>
  </ul>
</template>
