<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getThumbSrc } from '@/composables/useUtils'
import config from '@/config'
import PrimPagination from '@/components/PrimPagination.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const tagData = ref(route.meta.data?.tag?.items || {})
const pagination = ref({
  totalItems: route.meta.data?.tag?.total || 0,
  currentPage: route.meta.data?.tag?.current_page || 1,
  numPages: route.meta.data?.tag?.pages || 1,
  itemsPerPage: route.meta.data?.tag?.per_page || 10,
  maxSize: 3
})

// Set page title
if (tagData.value.tag) {
  document.title = tagData.value.tag + ' | ' + config.title
}

const rowClass = (type) => {
  switch (type) {
    case 1: return 'tagpage-tag'
    case 2: return 'tagpage-artist'
    case 3: return 'tagpage-character'
    case 4: return 'tagpage-copyright'
    default: return ''
  }
}

const tagTypeLabel = (type) => {
  switch (type) {
    case 1: return 'Tag: '
    case 2: return 'Artist: '
    case 3: return 'Character: '
    case 4: return 'Copyright: '
    default: return ''
  }
}

const onPageChange = (page) => {
  router.push('/tag/' + route.params.id + '/' + page)
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
  <div class="tagpage">
    <div class="tagpage_container">
      <div class="tagpage_header" :class="rowClass(tagData.type)">
        <div class="tag_title">
          <span>{{ tagTypeLabel(tagData.type) }}{{ tagData.tag }}</span>
        </div>
      </div>
      <div class="tagpage_nav">
        <PrimPagination
          :current-page="pagination.currentPage"
          :total-items="pagination.totalItems"
          :items-per-page="pagination.itemsPerPage"
          :max-size="pagination.maxSize"
          @update:current-page="onPageChange"
        />
      </div>
      <div v-if="pagination.totalItems !== 0" class="image_grid">
        <router-link v-for="image in tagData.images" :key="image.id" :to="'/image/' + image.id">
          <img :src="getThumbSrc(image.thumbnail, image.filename)" :height="image.tn_height" :width="image.tn_width">
        </router-link>
      </div>
      <div v-else class="no_tags">
        <span>No tags <i class="fa fa-frown-o"></i></span>
      </div>
      <div class="tagpage_nav">
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
