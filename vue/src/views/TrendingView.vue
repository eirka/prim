<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getThumbSrc } from '@/composables/useUtils'
import type { PopularResponse, NewestResponse, FavoritedResponse, ThumbnailImage } from '@/types'

const route = useRoute()

const raw = route.meta.data as { popular: PopularResponse; newest: NewestResponse; favorited: FavoritedResponse } | undefined
const popular = ref<ThumbnailImage[]>(raw?.popular?.popular || [])
const newest = ref<ThumbnailImage[]>(raw?.newest?.new || [])
const favorited = ref<ThumbnailImage[]>(raw?.favorited?.favorited || [])
</script>

<template>
  <div class="trending">
    <div class="trending_col">
      <div class="new_container">
        <div>
          <div class="new_title">
            <i class="fa fa-star-o"></i><span>Newest</span>
          </div>
          <div v-if="newest.length" class="image_grid">
            <router-link v-for="image in newest" :key="image.id" :to="'/image/' + image.id">
              <img :src="getThumbSrc(image.thumbnail, image.filename)" :height="image.tn_height" :width="image.tn_width">
            </router-link>
          </div>
        </div>
      </div>
      <div class="favorited_container">
        <div>
          <div class="favorited_title">
            <i class="fa fa-heart"></i><span>Top Favorites</span>
          </div>
          <div v-if="favorited.length" class="image_grid">
            <router-link v-for="image in favorited" :key="image.id" :to="'/image/' + image.id">
              <img :src="getThumbSrc(image.thumbnail, image.filename)" :height="image.tn_height" :width="image.tn_width">
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="trending_col">
      <div class="popular_container">
        <div>
          <div class="popular_title">
            <i class="fa fa-thumbs-o-up"></i><span>Popular</span>
          </div>
          <div v-if="popular.length" class="image_grid">
            <router-link v-for="image in popular" :key="image.id" :to="'/image/' + image.id">
              <img :src="getThumbSrc(image.thumbnail, image.filename)" :height="image.tn_height" :width="image.tn_width">
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
