<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getThumbSrc } from '@/composables/useUtils';
import PrimPagination from '@/components/PrimPagination.vue';
import type { FavoritesResponse, FavoritesDetail } from '@/types';

const route = useRoute();
const router = useRouter();

const raw = route.meta.data as FavoritesResponse | undefined;
const data = ref<FavoritesDetail>(raw?.favorites?.items || { images: [] });
const pagination = ref({
  totalItems: raw?.favorites?.total || 0,
  currentPage: raw?.favorites?.current_page || 1,
  numPages: raw?.favorites?.pages || 1,
  itemsPerPage: raw?.favorites?.per_page || 10,
  maxSize: 3,
});

const onPageChange = (page: number) => {
  if (page === 1) router.push('/favorites');
  else router.push('/favorites/' + page);
};

const onKeyDown = (e: KeyboardEvent) => {
  if (
    (e.target as HTMLElement).tagName === 'INPUT' ||
    (e.target as HTMLElement).tagName === 'TEXTAREA'
  )
    return;
  if (e.shiftKey && e.key === 'ArrowLeft' && pagination.value.currentPage > 1) {
    onPageChange(pagination.value.currentPage - 1);
  } else if (
    e.shiftKey &&
    e.key === 'ArrowRight' &&
    pagination.value.currentPage < pagination.value.numPages
  ) {
    onPageChange(pagination.value.currentPage + 1);
  }
};

onMounted(() => document.addEventListener('keydown', onKeyDown));
onUnmounted(() => document.removeEventListener('keydown', onKeyDown));
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
          <img
            :src="getThumbSrc(image.thumbnail, image.filename)"
            :height="image.tn_height"
            :width="image.tn_width"
          />
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
