<script setup lang="ts">
import { onMounted, ref } from 'vue';
import handlers from '@/api/handlers';
import { formatDate, getAvatar, getThumbSrc, usergroupClass } from '@/composables/useUtils';
import type { PostResponse } from '@/types';
import { getErrorMessage } from '@/types';

const props = defineProps<{
  id: number;
  thread: number;
}>();

const quotebox = ref<PostResponse | null>(null);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    quotebox.value = await handlers.post(props.thread, props.id);
  } catch (e) {
    error.value = getErrorMessage(e);
  }
});
</script>

<template>
  <div v-if="quotebox" class="quotebox">
    <div v-if="quotebox.post">
      <div v-if="quotebox.post.thumbnail">
        <a :href="`/image/${quotebox.post.img_id}`" aria-label="View image">
          <img
            class="quotebox_image"
            :src="getThumbSrc(quotebox.post.thumbnail, quotebox.post.filename)"
            alt=""
          />
        </a>
      </div>
      <div class="content">
        <div class="info">
          <div v-if="quotebox.post.group !== 1" class="avatar avatar-xsmall">
            <div class="avatar-inner">
              <img :src="getAvatar(quotebox.post.uid)" alt="" />
            </div>
          </div>
          <span class="post_info" :class="usergroupClass(quotebox.post.group)">{{
            quotebox.post.name
          }}</span>
          <span class="post_info">{{ formatDate(quotebox.post.time) }}</span>
          <span class="label label-light">#{{ quotebox.post.num }}</span>
        </div>
        <div v-if="quotebox.post.comment" class="quotebox_comment">
          <p>{{ quotebox.post.comment }}</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="error" class="quotebox_error">
    <p>{{ error }}</p>
  </div>
  <div v-else class="quotebox">
    <i class="fa fa-spinner fa-spin"></i>
  </div>
</template>
