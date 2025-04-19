<template>
  <div class="bg-white rounded-lg shadow-sm p-4">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium text-gray-900">Tren Harga Material</h3>
      <div class="flex gap-2">
        <select v-model="selectedMaterial" class="input-field text-sm">
          <option value="">Pilih Material</option>
          <option v-for="material in materials" :key="material.id" :value="material.id">
            {{ material.name }}
          </option>
        </select>
        <select v-model="timeRange" class="input-field text-sm">
          <option value="7">7 Hari Terakhir</option>
          <option value="30">30 Hari Terakhir</option>
          <option value="90">90 Hari Terakhir</option>
          <option value="180">6 Bulan Terakhir</option>
          <option value="365">1 Tahun Terakhir</option>
        </select>
      </div>
    </div>

    <div class="relative" style="height: 300px;">
      <canvas ref="chartCanvas"></canvas>
      <div v-if="!selectedMaterial" class="absolute inset-0 flex items-center justify-center text-gray-500">
        Pilih material untuk melihat tren harga
      </div>
      <div v-else-if="loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'
import { api } from '../services/api'

const props = defineProps({
  materials: {
    type: Array,
    required: true
  }
})

// State
const chartCanvas = ref(null)
const chart = ref(null)
const selectedMaterial = ref('')
const timeRange = ref('30')
const loading = ref(false)

// Methods
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short'
  })
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const loadPriceHistory = async () => {
  if (!selectedMaterial.value) return

  loading.value = true
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(timeRange.value))

    // Get price history
    const history = await api.getPriceHistory(selectedMaterial.value, startDate)

    // Get current material data
    const material = await api.getMaterial(selectedMaterial.value)

    // Combine historical prices with current price
    const prices = [...history]
    prices.push({
      created_at: new Date().toISOString(),
      new_price: material.base_price
    })

    updateChart(prices)
  } catch (error) {
    console.error('Error loading price history:', error)
  } finally {
    loading.value = false
  }
}

const updateChart = (prices) => {
  if (chart.value) {
    chart.value.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')
  chart.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: prices.map(p => formatDate(p.created_at)),
      datasets: [{
        label: 'Harga',
        data: prices.map(p => p.new_price),
        borderColor: '#2563eb',
        backgroundColor: '#93c5fd',
        tension: 0.3,
        fill: {
          target: 'origin',
          above: 'rgba(147, 197, 253, 0.1)'
        }
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              return `Harga: ${formatCurrency(context.parsed.y)}`
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: (value) => formatCurrency(value)
          }
        }
      }
    }
  })
}

// Watchers
watch([selectedMaterial, timeRange], () => {
  loadPriceHistory()
})

// Lifecycle
onMounted(() => {
  if (props.materials.length > 0) {
    selectedMaterial.value = props.materials[0].id
  }
})
</script>

<style scoped>
.input-field {
  @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm;
}
</style> 