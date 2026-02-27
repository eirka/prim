<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import modHandlers from '@/api/modHandlers';
import { getErrorMessage } from '@/types';

const props = defineProps<{
  threadId: number;
}>();

const router = useRouter();
const toast = useToast();

const closeThread = async () => {
  try {
    const data = await modHandlers.close(props.threadId);
    toast.success(data.success_message);
    router.go(0);
  } catch (e) {
    toast.error(getErrorMessage(e));
  }
};

const stickyThread = async () => {
  try {
    const data = await modHandlers.sticky(props.threadId);
    toast.success(data.success_message);
    router.go(0);
  } catch (e) {
    toast.error(getErrorMessage(e));
  }
};

const deleteThread = async () => {
  if (!confirm('Are you sure you want to delete this thread?')) return;
  try {
    const data = await modHandlers.deletethread(props.threadId);
    toast.success(data.success_message);
    router.push('/');
  } catch (e) {
    toast.error(getErrorMessage(e));
  }
};
</script>

<template>
  <div class="mod_controls thread_mod">
    <button class="button button-mod" @click="closeThread" title="Close/Open Thread">
      <i class="fa fa-lock"></i>
    </button>
    <button class="button button-mod" @click="stickyThread" title="Sticky/Unsticky Thread">
      <i class="fa fa-thumb-tack"></i>
    </button>
    <button class="button button-mod" @click="deleteThread" title="Delete Thread">
      <i class="fa fa-trash"></i>
    </button>
  </div>
</template>
