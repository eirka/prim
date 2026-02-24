<script setup>
import { ref, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import modHandlers from '@/api/modHandlers'
import { apiError } from '@/composables/useUtils'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const chartData = ref(null)
const chartOptions = {
  responsive: true,
  scales: {
    x: { grid: { display: false } },
    y: { grid: { display: false } }
  },
  elements: {
    point: { radius: 0 },
    line: { tension: 0 }
  }
}

const colors = ['#BF4848', '#4883BF']

onMounted(async () => {
  try {
    const data = await modHandlers.statistics()
    const labels = (data.labels || []).map(l => new Date(l).toLocaleString(undefined, { month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }))
    const datasets = (data.series || []).map((s, i) => ({
      label: s.name,
      data: s.data,
      borderColor: colors[i] || '#000',
      fill: false
    }))
    chartData.value = { labels, datasets }
  } catch (e) {
    apiError(e.status)
  }
})
</script>

<template>
  <div class="admin_statistics">
    <h3>Board Statistics</h3>
    <Line v-if="chartData" :data="chartData" :options="chartOptions" />
    <div v-else class="loading">
      <i class="fa fa-spinner fa-spin"></i> Loading statistics...
    </div>
  </div>
</template>
