<script setup lang="ts">
import { ref } from 'vue';
import HoverBox from './HoverBox.vue';

defineProps<{
  id: string;
  thread: number;
}>();

const show = ref(false);
const toggle = () => {
  show.value = !show.value;
};
const open = () => {
  show.value = true;
};
const close = () => {
  show.value = false;
};
</script>

<template>
  <span class="angular-hovercard">
    <a
      class="label label-default"
      href="#"
      @click.prevent="toggle"
      @mouseenter="open"
      @mouseleave="close"
    >
      &gt;&gt;{{ id }}
    </a>
    <div v-if="show" class="angular-hovercard-detail">
      <HoverBox :id="id" :thread="thread" />
    </div>
  </span>
</template>
