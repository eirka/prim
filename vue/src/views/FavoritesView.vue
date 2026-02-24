<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getThumbSrc } from '@/composables/useUtils'
import PrimPagination from '@/components/PrimPagination.vue'

const route = useRoute()
const router = useRouter()

const data = ref(route.meta.data?.favorites?.items || {})
const pagination = ref({
  totalItems: route.meta.data?.favorites?.total || 0,
  currentPage: route.meta.data?.favorites?.current_page || 1,
  numPages: route.meta.data?.favorites?.pages || 1,
  itemsPerPage: route.meta.data?.favorites?.per_page || 10,
  maxSize: 3
})

const onPageChange = (page) => {
  if (page === 1) router.push('/favorites')
  else router.push('/favorites/' + page)
}

const onKeyDown = (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
  if (e.shiftKey && e.key === 'ArrowLeft' && pagination.value.currentPage > 1) {
    onPageChange(pagination.value.currentPage - 1)
  } else if (e.shiftKey && e.key === 'ArrowRight' && pagination.value.currentPage < pagination.value.numPages) {
    onPageChange(pagination.value.currentPage + 1)
  }
}

onMounted(() => document.addEventListener('keydown', onKeyDown))
onUnmounted(() => document.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <div class="favorites">
    <div class="favorites_container">
      <div class="favorites_title">
        <span>Favorites</span>
      </div>
      <div class="favorites_nav">
        <PrimPagination
          :current-page="pagination.currentPage"
          :total-items="pagination.totalItems"
          :items-per-page="pagination.itemsPerPage"
          :max-size="pagination.maxSize"
          @update:current-page="onPageChange"
        />
      </div>
      <div v-if="pagination.totalItems !== 0" class="image_grid">
        <router-link v-for="image in data.images" :key="image.id" :to="'/image/' + image.id">
          <img :src="getThumbSrc(image.thumbnail, image.filename)" :height="image.tn_height" :width="image.tn_width">
        </router-link>
      </div>
      <div v-else class="no_favorites">
        <span>No favorites <i class="fa fa-frown-o"></i></span>
      </div>
      <div class="favorites_nav">
        <PrimPagination
          :current-page="pagination.currentPage"
          :total-items="pagination.totalItems"
          :items-per-page="pagination.itemsPerPage"
          :max-size="pagination.maxSize"
          @update:current-page="onPageChange"
        />
      </div>
    </div>
  </div>
</template>
