<script setup>
import { ref, onMounted } from 'vue'
import handlers from '@/api/handlers'
import { usergroupClass, getAvatar, getThumbSrc } from '@/composables/useUtils'

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
  <div v-if="quotebox" class="box">
    <div v-if="quotebox.post" class="box_content">
      <div class="box_header">
        <div v-if="quotebox.post.group !== 1" class="avatar avatar-xsmall">
          <div class="avatar-inner">
            <img :src="getAvatar(quotebox.post.uid)" />
          </div>
        </div>
        <span :class="usergroupClass(quotebox.post.group)">{{ quotebox.post.name }}</span>
      </div>
      <div v-if="quotebox.post.thumbnail" class="box_image">
        <img :src="getThumbSrc(quotebox.post.thumbnail, quotebox.post.filename)" />
      </div>
      <div v-if="quotebox.post.comment" class="box_comment">
        <p>{{ quotebox.post.comment }}</p>
      </div>
    </div>
  </div>
  <div v-else-if="error" class="box box_error">
    <p>{{ error.error_message || 'Error loading post' }}</p>
  </div>
  <div v-else class="box box_loading">
    <i class="fa fa-spinner fa-spin"></i>
  </div>
</template>
