<script setup>
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import modHandlers from '@/api/modHandlers'

const props = defineProps({
  threadId: { type: Number, required: true },
  postId: { type: Number, required: true }
})

const router = useRouter()
const toast = useToast()

const deletePost = async () => {
  if (!confirm('Are you sure you want to delete this post?')) return
  try {
    const data = await modHandlers.deletepost(props.threadId, props.postId)
    toast.success(data.success_message)
    router.go(0)
  } catch (e) {
    toast.error(e.data?.error_message || 'Error')
  }
}

const banIp = async () => {
  const reason = prompt('Please enter a reason for the ban')
  if (!reason) return
  try {
    const data = await modHandlers.banip(props.threadId, props.postId, reason)
    toast.success(data.success_message)
  } catch (e) {
    toast.error(e.data?.error_message || 'Error')
  }
}

const banFile = async () => {
  const reason = prompt('Please enter a reason for the ban')
  if (!reason) return
  try {
    const data = await modHandlers.banfile(props.threadId, props.postId, reason)
    toast.success(data.success_message)
  } catch (e) {
    toast.error(e.data?.error_message || 'Error')
  }
}
</script>

<template>
  <div class="info_item mod_controls">
    <a class="label label-mod" href="#" @click.prevent="deletePost" title="Delete Post"><i class="fa fa-times"></i></a>
    <a class="label label-mod" href="#" @click.prevent="banIp" title="Ban IP"><i class="fa fa-ban"></i></a>
    <a class="label label-mod" href="#" @click.prevent="banFile" title="Ban File"><i class="fa fa-file-o"></i></a>
  </div>
</template>
