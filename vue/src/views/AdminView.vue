<script setup>
import { ref } from 'vue'
import AdminStatistics from '@/components/admin/AdminStatistics.vue'
import AdminBoardLog from '@/components/admin/AdminBoardLog.vue'
import AdminModLog from '@/components/admin/AdminModLog.vue'

const panels = [
  { name: 'Statistics', component: AdminStatistics },
  { name: 'Board Log', component: AdminBoardLog },
  { name: 'Mod Log', component: AdminModLog }
]

const activePanel = ref(panels[0])
</script>

<template>
  <div class="admin">
    <div class="settings_container">
      <div class="settings_menu">
        <button
          v-for="panel in panels"
          :key="panel.name"
          class="button button-block button-primary"
          :class="{ active: activePanel.name === panel.name }"
          @click="activePanel = panel"
        >{{ panel.name }}</button>
      </div>
      <div class="settings_box">
        <component :is="activePanel.component" />
      </div>
    </div>
  </div>
</template>
