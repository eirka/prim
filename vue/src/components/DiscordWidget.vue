<script setup lang="ts">
import { ref, onMounted } from 'vue';
import config from '@/config';

const inviteLink = ref<string | null>(null);
const userCount = ref(0);

onMounted(async () => {
  if (!config.discord_widget) return;
  try {
    const res = await fetch(config.discord_widget);
    const data = await res.json();
    inviteLink.value = data.instant_invite || null;
    userCount.value = data.presence_count ?? 0;
  } catch {
    /* ignore */
  }
});
</script>

<template>
  <li v-if="inviteLink">
    <a :href="inviteLink" target="_blank">
      Chat <span class="label label-success">{{ userCount }}</span>
    </a>
  </li>
</template>

<style scoped>
.label {
  position: relative;
  top: -0.1em;
}
</style>
