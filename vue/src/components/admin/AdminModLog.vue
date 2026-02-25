<script setup>
import { ref, onMounted } from 'vue'
import modHandlers from '@/api/modHandlers'
import { usergroupClass, apiError, formatDate } from '@/composables/useUtils'
import PrimPagination from '@/components/PrimPagination.vue'

const data = ref([])
const pagination = ref({ totalItems: 0, currentPage: 1, numPages: 1, itemsPerPage: 10, maxSize: 3 })

const getLog = async (page) => {
  try {
    const result = await modHandlers.modlog(page)
    data.value = result.modlog.items
    pagination.value = {
      totalItems: result.modlog.total,
      currentPage: result.modlog.current_page,
      numPages: result.modlog.pages,
      itemsPerPage: result.modlog.per_page,
      maxSize: 3
    }
  } catch (e) {
    apiError(e.status)
  }
}

onMounted(() => getLog(1))

const onPageChange = (page) => getLog(page)
</script>

<template>
  <div class="admin_log">
    <h3>Mod Log</h3>
    <table v-if="data.length">
      <thead>
        <tr>
          <th>User</th>
          <th>Action</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in data" :key="entry.id">
          <td><span :class="usergroupClass(entry.group)">{{ entry.name }}</span></td>
          <td>{{ entry.action }}</td>
          <td>{{ formatDate(entry.log_time) }}</td>
        </tr>
      </tbody>
    </table>
    <PrimPagination
      :current-page="pagination.currentPage"
      :total-items="pagination.totalItems"
      :items-per-page="pagination.itemsPerPage"
      :max-size="pagination.maxSize"
      @update:current-page="onPageChange"
    />
  </div>
</template>
