<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import modHandlers from '@/api/modHandlers';
import { getErrorMessage } from '@/types';

const props = defineProps<{
  threadId: number;
  postId: number;
}>();

const router = useRouter();
const toast = useToast();

const deletePost = async () => {
  if (!confirm('Are you sure you want to delete this post?')) return;
  try {
    const data = await modHandlers.deletepost(props.threadId, props.postId);
    toast.success(data.success_message);
    router.go(0);
  } catch (e) {
    toast.error(getErrorMessage(e));
  }
};

const banIp = async () => {
  const reason = prompt('Please enter a reason for the ban');
  if (!reason) return;
  try {
    const data = await modHandlers.banip(props.threadId, props.postId, reason);
    toast.success(data.success_message);
  } catch (e) {
    toast.error(getErrorMessage(e));
  }
};

const banFile = async () => {
  const reason = prompt('Please enter a reason for the ban');
  if (!reason) return;
  try {
    const data = await modHandlers.banfile(props.threadId, props.postId, reason);
    toast.success(data.success_message);
  } catch (e) {
    toast.error(getErrorMessage(e));
  }
};
</script>

<template>
  <div class="post_mod_buttons">
    <a title="Ban IP" class="button button-danger" href="#" @click.prevent="banIp">BAN IP</a>
    <a title="Ban File" class="button button-danger" href="#" @click.prevent="banFile">BAN FILE</a>
    <a title="Delete" class="button button-danger" href="#" @click.prevent="deletePost">DELETE</a>
  </div>
</template>
