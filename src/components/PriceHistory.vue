<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden">
    <div class="p-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">Riwayat Perubahan Harga</h3>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tanggal
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Material
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Harga Lama
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Harga Baru
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Perubahan
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Alasan
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="history in priceHistory" :key="history.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(history.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ getMaterialName(history.material_id) }}
              </div>
              <div class="text-sm text-gray-500">
                {{ getMaterialCategory(history.material_id) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              Rp {{ formatNumber(history.old_price) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              Rp {{ formatNumber(history.new_price) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-red-100 text-red-800': history.change_percentage > 0,
                  'bg-green-100 text-green-800': history.change_percentage < 0,
                  'bg-gray-100 text-gray-800': history.change_percentage === 0
                }"
              >
                {{ formatPercentage(history.change_percentage) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ history.change_reason || '-' }}
            </td>
          </tr>
          <tr v-if="priceHistory.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
              Belum ada riwayat perubahan harga
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
      <div class="flex items-center justify-between">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="btn-secondary"
          >
            Sebelumnya
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="btn-secondary"
          >
            Selanjutnya
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Menampilkan
              <span class="font-medium">{{ startItem }}</span>
              sampai
              <span class="font-medium">{{ endItem }}</span>
              dari
              <span class="font-medium">{{ totalItems }}</span>
              hasil
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="btn-pagination"
              >
                Sebelumnya
              </button>
              <button
                v-for="page in displayedPages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'btn-pagination',
                  currentPage === page ? 'bg-primary text-white' : 'bg-white text-gray-700'
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="btn-pagination"
              >
                Selanjutnya
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { api } from '../services/api'

const props = defineProps({
  materials: {
    type: Array,
    required: true
  }
})

// State
const priceHistory = ref([])
const currentPage = ref(1)
const itemsPerPage = 10
const totalItems = ref(0)

// Computed
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))
const startItem = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage, totalItems.value))

const displayedPages = computed(() => {
  const pages = []
  const maxPages = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxPages / 2))
  let end = Math.min(totalPages.value, start + maxPages - 1)

  if (end - start + 1 < maxPages) {
    start = Math.max(1, end - maxPages + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatNumber = (number) => {
  return new Intl.NumberFormat('id-ID').format(number)
}

const formatPercentage = (percentage) => {
  const sign = percentage > 0 ? '+' : ''
  return `${sign}${percentage.toFixed(1)}%`
}

const getMaterialName = (materialId) => {
  const material = props.materials.find(m => m.id === materialId)
  return material ? material.name : 'Material tidak ditemukan'
}

const getMaterialCategory = (materialId) => {
  const material = props.materials.find(m => m.id === materialId)
  return material ? material.category : ''
}

const loadPriceHistory = async () => {
  try {
    // Get total count
    const allHistory = await api.getPriceHistory()
    totalItems.value = allHistory.length

    // Get paginated data
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    priceHistory.value = allHistory.slice(start, end)
  } catch (error) {
    console.error('Error loading price history:', error)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page) => {
  currentPage.value = page
}

// Watch for page changes
watch(currentPage, () => {
  loadPriceHistory()
})

// Initial load
onMounted(() => {
  loadPriceHistory()
})
</script>

<style scoped>
.btn-pagination {
  @apply relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary;
}

.btn-secondary {
  @apply relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary;
}
</style> 