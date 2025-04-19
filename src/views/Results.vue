<template>
  <div class="max-w-4xl mx-auto">
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p class="mt-4 text-gray-600">Memuat hasil perhitungan...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 p-6 rounded-lg">
      <h2 class="text-red-800 text-lg font-medium">Terjadi Kesalahan</h2>
      <p class="mt-2 text-red-700">{{ error }}</p>
      <router-link to="/calculator" class="mt-4 inline-block text-red-600 hover:text-red-500">
        Kembali ke Kalkulator
      </router-link>
    </div>

    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="bg-white shadow-sm rounded-lg p-6">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ project.projectName }}</h2>
            <p class="mt-1 text-gray-600">{{ project.location }}</p>
          </div>
          <button
            @click="printResults"
            class="btn-primary flex items-center"
          >
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      <!-- Informasi Proyek -->
      <div class="bg-white shadow-sm rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Informasi Proyek</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="text-sm font-medium text-gray-500">Dimensi Bangunan</h4>
            <div class="mt-2 space-y-2">
              <p>Panjang: {{ project.length }} meter</p>
              <p>Lebar: {{ project.width }} meter</p>
              <p>Tinggi: {{ project.height }} meter</p>
              <p>Luas: {{ project.area }} m²</p>
              <p>Volume: {{ project.volume }} m³</p>
            </div>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500">Spesifikasi</h4>
            <div class="mt-2 space-y-2">
              <p>Jenis: {{ getBuildingType(project.buildingType) }}</p>
              <p>Jumlah Lantai: {{ project.floors }}</p>
              <p>Kualitas: {{ getBuildingQuality(project.buildingQuality) }}</p>
              <p>Tipe Lokasi: {{ getLocationType(project.locationType) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Hasil Perhitungan -->
      <div class="bg-white shadow-sm rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Estimasi Biaya</h3>
        <div class="space-y-4">
          <div v-for="(item, index) in costBreakdown" :key="index" class="border-b pb-4">
            <div class="flex justify-between items-center">
              <span class="font-medium">{{ item.name }}</span>
              <span class="text-gray-900">Rp {{ formatNumber(item.cost) }}</span>
            </div>
            <p class="text-sm text-gray-600 mt-1">{{ item.description }}</p>
          </div>

          <div class="pt-4">
            <div class="flex justify-between items-center text-lg font-bold">
              <span>Total Estimasi</span>
              <span class="text-primary">Rp {{ formatNumber(totalCost) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Catatan -->
      <div class="bg-yellow-50 p-4 rounded-lg">
        <p class="text-sm text-yellow-800">
          * Estimasi ini adalah perkiraan kasar dan dapat bervariasi tergantung pada kondisi aktual, 
          harga material, dan faktor lainnya. Konsultasikan dengan kontraktor profesional untuk 
          perhitungan yang lebih akurat.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../supabase'

const route = useRoute()
const router = useRouter()

const project = ref(null)
const loading = ref(true)
const error = ref(null)

// Konstanta untuk perhitungan
const COST_PER_M2 = {
  standard: {
    residential: 3500000,
    commercial: 4500000,
    office: 5000000
  },
  medium: {
    residential: 4500000,
    commercial: 5500000,
    office: 6000000
  },
  premium: {
    residential: 6000000,
    commercial: 7000000,
    office: 7500000
  }
}

const LOCATION_MULTIPLIER = {
  urban: 1.2,
  suburban: 1.0,
  rural: 0.8
}

// Helper functions
const getBuildingType = (type) => ({
  residential: 'Rumah Tinggal',
  commercial: 'Bangunan Komersial',
  office: 'Kantor'
})[type] || type

const getBuildingQuality = (quality) => ({
  standard: 'Standar',
  medium: 'Menengah',
  premium: 'Premium'
})[quality] || quality

const getLocationType = (type) => ({
  urban: 'Perkotaan',
  suburban: 'Pinggiran Kota',
  rural: 'Pedesaan'
})[type] || type

const formatNumber = (number) => {
  return new Intl.NumberFormat('id-ID').format(number)
}

// Computed values
const costBreakdown = ref([])
const totalCost = ref(0)

const calculateCosts = () => {
  const baseCost = COST_PER_M2[project.value.buildingQuality][project.value.buildingType]
  const locationMultiplier = LOCATION_MULTIPLIER[project.value.locationType]
  const area = project.value.area
  const floors = project.value.floors

  // Biaya konstruksi dasar
  const constructionCost = baseCost * area * floors * locationMultiplier
  
  // Breakdown biaya
  costBreakdown.value = [
    {
      name: 'Biaya Konstruksi Dasar',
      cost: constructionCost,
      description: 'Meliputi material dan tenaga kerja untuk konstruksi utama'
    },
    {
      name: 'Biaya Pondasi',
      cost: constructionCost * 0.15,
      description: 'Persiapan lahan dan pekerjaan pondasi'
    },
    {
      name: 'Instalasi MEP',
      cost: constructionCost * 0.2,
      description: 'Mekanikal, Elektrikal, dan Pemipaan'
    },
    {
      name: 'Finishing',
      cost: constructionCost * 0.25,
      description: 'Pekerjaan finishing interior dan eksterior'
    },
    {
      name: 'Biaya Overhead',
      cost: constructionCost * 0.1,
      description: 'Biaya manajemen dan overhead proyek'
    }
  ]

  // Hitung total
  totalCost.value = costBreakdown.value.reduce((acc, item) => acc + item.cost, 0)
}

// Load data
onMounted(async () => {
  try {
    const { data, error: err } = await supabase
      .from('projects')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (err) throw err

    project.value = data
    calculateCosts()
  } catch (err) {
    error.value = 'Gagal memuat data proyek'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
})

// Print function
const printResults = () => {
  window.print()
}
</script>

<style>
@media print {
  body * {
    visibility: hidden;
  }
  .max-w-4xl * {
    visibility: visible;
  }
  .max-w-4xl {
    position: absolute;
    left: 0;
    top: 0;
  }
  .btn-primary {
    display: none;
  }
}
</style> 