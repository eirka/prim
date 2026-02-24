<script setup>
import { ref, onMounted } from 'vue'
import config from '@/config'

const inviteLink = ref(null)
const userCount = ref(0)

onMounted(async () => {
  if (!config.discord_widget) return
  try {
    const res = await fetch(config.discord_widget)
    const data = await res.json()
    inviteLink.value = data.instant_invite
    userCount.value = data.members.length
  } catch { /* ignore */ }
})
</script>

<template>
  <li v-if="inviteLink">
    <a :href="inviteLink" target="_blank">
      <i class="fa fa-gamepad"></i> Discord ({{ userCount }})
    </a>
  </li>
</template>
