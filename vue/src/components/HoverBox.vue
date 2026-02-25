<script setup>
import { ref, onMounted } from 'vue'
import handlers from '@/api/handlers'
import { usergroupClass, getAvatar, getThumbSrc, formatDate } from '@/composables/useUtils'

const props = defineProps({
  id: { type: String, required: true },
  thread: { type: Number, required: true }
})

const quotebox = ref(null)
const error = ref(null)

onMounted(async () => {
  try {
    quotebox.value = await handlers.post(props.thread, props.id)
  } catch (e) {
    error.value = e.data
  }
})
</script>

<template>
  <div v-if="quotebox" class="quotebox">
    <div v-if="quotebox.post">
      <div v-if="quotebox.post.thumbnail">
        <a :href="'/image/' + quotebox.post.img_id">
          <img class="quotebox_image" :src="getThumbSrc(quotebox.post.thumbnail, quotebox.post.filename)" />
        </a>
      </div>
      <div class="content">
        <div class="info">
          <div v-if="quotebox.post.group !== 1" class="avatar avatar-xsmall">
            <div class="avatar-inner">
              <img :src="getAvatar(quotebox.post.uid)" />
            </div>
          </div>
          <span class="post_info" :class="usergroupClass(quotebox.post.group)">{{ quotebox.post.name }}</span>
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
    <p>{{ error.error_message || 'Error loading post' }}</p>
  </div>
  <div v-else class="quotebox">
    <i class="fa fa-spinner fa-spin"></i>
  </div>
</template>
