<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white shadow-sm rounded-lg p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Perhitungan RAB Konstruksi</h2>
      
      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Informasi Dasar -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Informasi Dasar Proyek</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nama Proyek</label>
              <input 
                type="text" 
                v-model="formData.projectName"
                class="input-field"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Lokasi</label>
              <input 
                type="text" 
                v-model="formData.location"
                class="input-field"
                required
              />
            </div>
          </div>
        </div>

        <!-- Dimensi Bangunan -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Dimensi Bangunan</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Panjang (meter)</label>
              <input 
                type="number" 
                v-model.number="formData.length"
                class="input-field"
                min="0"
                step="0.1"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Lebar (meter)</label>
              <input 
                type="number" 
                v-model.number="formData.width"
                class="input-field"
                min="0"
                step="0.1"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Tinggi (meter)</label>
              <input 
                type="number" 
                v-model.number="formData.height"
                class="input-field"
                min="0"
                step="0.1"
                required
              />
            </div>
          </div>
        </div>

        <!-- Spesifikasi Bangunan -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Spesifikasi Bangunan</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Jenis Bangunan</label>
              <select 
                v-model="formData.buildingType"
                class="input-field"
                required
              >
                <option value="">Pilih jenis bangunan</option>
                <option value="residential">Rumah Tinggal</option>
                <option value="commercial">Bangunan Komersial</option>
                <option value="office">Kantor</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Jumlah Lantai</label>
              <input 
                type="number" 
                v-model.number="formData.floors"
                class="input-field"
                min="1"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Kualitas Bangunan</label>
              <select 
                v-model="formData.buildingQuality"
                class="input-field"
                required
              >
                <option value="">Pilih kualitas bangunan</option>
                <option value="standard">Standar</option>
                <option value="medium">Menengah</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Lokasi Tipe</label>
              <select 
                v-model="formData.locationType"
                class="input-field"
                required
              >
                <option value="">Pilih tipe lokasi</option>
                <option value="urban">Perkotaan</option>
                <option value="suburban">Pinggiran Kota</option>
                <option value="rural">Pedesaan</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Tombol Submit -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="resetForm"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            class="btn-primary"
          >
            Hitung Estimasi
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'

const router = useRouter()

const formData = ref({
  projectName: '',
  location: '',
  length: null,
  width: null,
  height: null,
  buildingType: '',
  floors: 1,
  buildingQuality: '',
  locationType: ''
})

const resetForm = () => {
  formData.value = {
    projectName: '',
    location: '',
    length: null,
    width: null,
    height: null,
    buildingType: '',
    floors: 1,
    buildingQuality: '',
    locationType: ''
  }
}

const handleSubmit = async () => {
  try {
    // Hitung luas dan volume
    const area = formData.value.length * formData.value.width
    const volume = area * formData.value.height

    // Simpan data ke Supabase
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          ...formData.value,
          area,
          volume,
          status: 'pending'
        }
      ])
      .select()

    if (error) throw error

    // Redirect ke halaman hasil dengan ID proyek
    router.push({
      name: 'Results',
      params: { id: data[0].id }
    })
  } catch (error) {
    console.error('Error:', error)
    alert('Terjadi kesalahan saat memproses data')
  }
}
</script> 