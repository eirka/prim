<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import modHandlers from '@/api/modHandlers';
import { getErrorMessage } from '@/types';

const props = defineProps<{
  threadId: number;
  closed: boolean;
  sticky: boolean;
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
  <div class="thread_mod_buttons">
    <a
      title="Delete"
      class="button button-danger fa fa-trash-o"
      href="#"
      @click.prevent="deleteThread"
    ></a>
    <a
      v-if="!closed"
      title="Close"
      class="button button-primary fa fa-unlock-alt"
      href="#"
      @click.prevent="closeThread"
    ></a>
    <a
      v-if="closed"
      title="Open"
      class="button button-success fa fa-lock"
      href="#"
      @click.prevent="closeThread"
    ></a>
    <a
      v-if="!sticky"
      title="Sticky"
      class="button button-primary fa fa-thumb-tack"
      href="#"
      @click.prevent="stickyThread"
    ></a>
    <a
      v-if="sticky"
      title="Unsticky"
      class="button button-success fa fa-thumb-tack"
      href="#"
      @click.prevent="stickyThread"
    ></a>
  </div>
</template>
