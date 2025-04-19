<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold text-gray-900">Manajemen Material</h1>
      <div class="flex gap-2">
        <label 
          class="btn-secondary cursor-pointer"
          :class="{ 'opacity-50 cursor-not-allowed': isImporting }"
        >
          <input
            type="file"
            class="hidden"
            accept=".xlsx,.xls"
            @change="handleFileImport"
            :disabled="isImporting"
          >
          {{ isImporting ? 'Mengimpor...' : 'Impor Excel' }}
        </label>
        <button
          @click="exportToExcel"
          class="btn-secondary"
          :disabled="isExporting"
        >
          {{ isExporting ? 'Mengekspor...' : 'Ekspor Excel' }}
        </button>
        <button
          @click="openAddModal"
          class="btn-primary"
        >
          Tambah Material
        </button>
      </div>
    </div>

    <!-- Grafik Tren Harga -->
    <div class="mb-6" style="height: 400px;">
      <PriceChart :materials="materials" />
    </div>

    <!-- Filter dan Pencarian -->
    <div class="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Kategori</label>
          <select v-model="filters.category" class="input-field">
            <option value="">Semua Kategori</option>
            <option value="struktur">Struktur</option>
            <option value="dinding">Dinding</option>
            <option value="finishing">Finishing</option>
            <option value="mep">MEP</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Status</label>
          <select v-model="filters.status" class="input-field">
            <option value="">Semua Status</option>
            <option value="true">Aktif</option>
            <option value="false">Tidak Aktif</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Cari</label>
          <input
            type="text"
            v-model="filters.search"
            placeholder="Cari material..."
            class="input-field"
          />
        </div>
      </div>
    </div>

    <!-- Tabel Material -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Material
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kategori
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Harga Dasar
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Unit
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="material in filteredMaterials" :key="material.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ material.name }}</div>
              <div class="text-sm text-gray-500">{{ material.description }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-blue-100 text-blue-800': material.category === 'struktur',
                  'bg-green-100 text-green-800': material.category === 'dinding',
                  'bg-yellow-100 text-yellow-800': material.category === 'finishing',
                  'bg-purple-100 text-purple-800': material.category === 'mep'
                }"
              >
                {{ material.category }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              Rp {{ formatNumber(material.base_price) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ material.unit }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="material.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ material.is_active ? 'Aktif' : 'Tidak Aktif' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="editMaterial(material)"
                class="text-primary hover:text-primary-dark mr-3"
              >
                Edit
              </button>
              <button
                @click="toggleMaterialStatus(material)"
                class="text-gray-600 hover:text-gray-900"
              >
                {{ material.is_active ? 'Nonaktifkan' : 'Aktifkan' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Tambah/Edit Material -->
    <div v-if="showAddModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 class="text-xl font-bold mb-4">{{ editingMaterial ? 'Edit' : 'Tambah' }} Material</h2>
        <form @submit.prevent="saveMaterial" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nama Material</label>
            <input
              type="text"
              v-model="materialForm.name"
              required
              class="input-field"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Kategori</label>
            <select v-model="materialForm.category" required class="input-field">
              <option value="struktur">Struktur</option>
              <option value="dinding">Dinding</option>
              <option value="finishing">Finishing</option>
              <option value="mep">MEP</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Harga Dasar</label>
            <input
              type="number"
              v-model.number="materialForm.base_price"
              required
              min="0"
              class="input-field"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Unit</label>
            <input
              type="text"
              v-model="materialForm.unit"
              required
              class="input-field"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea
              v-model="materialForm.description"
              rows="3"
              class="input-field"
            ></textarea>
          </div>
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showAddModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              class="btn-primary"
            >
              {{ editingMaterial ? 'Simpan' : 'Tambah' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="mt-8">
      <PriceHistory :materials="materials" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PriceChart from '../components/PriceChart.vue'
import PriceHistory from '../components/PriceHistory.vue'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { api } from '../services/api'

// State
const materials = ref([])
const showAddModal = ref(false)
const editingMaterial = ref(null)
const filters = ref({
  category: '',
  status: '',
  search: ''
})

const materialForm = ref({
  name: '',
  category: 'struktur',
  base_price: 0,
  unit: '',
  description: '',
  is_active: true
})

const isImporting = ref(false)
const isExporting = ref(false)

// Computed
const filteredMaterials = computed(() => {
  let result = [...materials.value]

  if (filters.value.category) {
    result = result.filter(m => m.category === filters.value.category)
  }

  if (filters.value.status !== '') {
    const isActive = filters.value.status === 'true'
    result = result.filter(m => m.is_active === isActive)
  }

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(m => 
      m.name.toLowerCase().includes(search) ||
      m.description?.toLowerCase().includes(search)
    )
  }

  return result
})

// Methods
const formatNumber = (number) => {
  return new Intl.NumberFormat('id-ID').format(number)
}

const loadMaterials = async () => {
  try {
    const data = await api.getMaterials()
    materials.value = data
  } catch (error) {
    console.error('Error:', error)
    alert('Gagal memuat data material')
  }
}

const editMaterial = (material) => {
  editingMaterial.value = material
  materialForm.value = { ...material }
  showAddModal.value = true
}

const resetForm = () => {
  materialForm.value = {
    name: '',
    category: 'struktur',
    base_price: 0,
    unit: '',
    description: '',
    is_active: true
  }
  editingMaterial.value = null
}

const saveMaterial = async () => {
  if (!validateForm()) return

  try {
    if (editingMaterial.value.id) {
      // Get current material data
      const currentMaterial = await api.getMaterial(editingMaterial.value.id)

      // Update material
      await api.updateMaterial(editingMaterial.value.id, {
        name: editingMaterial.value.name,
        category: editingMaterial.value.category,
        base_price: editingMaterial.value.base_price,
        unit: editingMaterial.value.unit,
        description: editingMaterial.value.description
      })

      // Create price history if price changed
      if (currentMaterial.base_price !== editingMaterial.value.base_price) {
        await api.createPriceHistory({
          id: api.generateId(),
          material_id: editingMaterial.value.id,
          old_price: currentMaterial.base_price,
          new_price: editingMaterial.value.base_price,
          change_percentage: ((editingMaterial.value.base_price - currentMaterial.base_price) / currentMaterial.base_price) * 100,
          change_reason: editingMaterial.value.change_reason || 'Update manual',
          changed_by: 'user'
        })
      }
    } else {
      // Create new material
      const newMaterial = {
        id: api.generateId(),
        name: editingMaterial.value.name,
        category: editingMaterial.value.category,
        base_price: editingMaterial.value.base_price,
        unit: editingMaterial.value.unit,
        description: editingMaterial.value.description,
        is_active: true
      }
      await api.createMaterial(newMaterial)
    }

    // Reload materials and close modal
    loadMaterials()
    closeModal()
  } catch (error) {
    console.error('Error saving material:', error)
    alert('Terjadi kesalahan saat menyimpan data')
  }
}

const toggleMaterialStatus = async (material) => {
  try {
    await api.updateMaterial(material.id, { is_active: !material.is_active })
    await loadMaterials()
  } catch (error) {
    console.error('Error:', error)
    alert('Gagal mengubah status material')
  }
}

const handleFileImport = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  isImporting.value = true
  try {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      // Validate data structure
      const isValidData = jsonData.every(row => 
        row.name && 
        row.category && 
        typeof row.base_price === 'number' && 
        row.unit
      )

      if (!isValidData) {
        alert('Format data Excel tidak valid. Pastikan file memiliki kolom: name, category, base_price, dan unit')
        return
      }

      // Import data
      for (const row of jsonData) {
        const existingMaterials = await api.getMaterials()
        const existingMaterial = existingMaterials.find(m => m.name === row.name)

        if (existingMaterial) {
          // Update existing material
          if (existingMaterial.base_price !== row.base_price) {
            // Create price history
            await api.createPriceHistory({
              id: api.generateId(),
              material_id: existingMaterial.id,
              old_price: existingMaterial.base_price,
              new_price: row.base_price,
              change_percentage: ((row.base_price - existingMaterial.base_price) / existingMaterial.base_price) * 100,
              change_reason: 'Impor dari Excel',
              changed_by: 'system'
            })
          }

          await api.updateMaterial(existingMaterial.id, {
            category: row.category,
            base_price: row.base_price,
            unit: row.unit,
            description: row.description || null
          })
        } else {
          // Create new material
          await api.createMaterial({
            id: api.generateId(),
            name: row.name,
            category: row.category,
            base_price: row.base_price,
            unit: row.unit,
            description: row.description || null,
            is_active: true
          })
        }
      }

      // Reload materials
      loadMaterials()
      alert('Data berhasil diimpor')
    }
    reader.readAsArrayBuffer(file)
  } catch (error) {
    console.error('Error importing data:', error)
    alert('Terjadi kesalahan saat mengimpor data')
  } finally {
    isImporting.value = false
    event.target.value = '' // Reset file input
  }
}

const exportToExcel = async () => {
  isExporting.value = true
  try {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredMaterials.value.map(material => ({
        name: material.name,
        category: material.category,
        base_price: material.base_price,
        unit: material.unit,
        status: material.is_active ? 'Aktif' : 'Tidak Aktif',
        description: material.description || ''
      }))
    )

    // Set column widths
    const wscols = [
      { wch: 30 }, // name
      { wch: 20 }, // category
      { wch: 15 }, // base_price
      { wch: 10 }, // unit
      { wch: 12 }, // status
      { wch: 40 }  // description
    ]
    worksheet['!cols'] = wscols

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Materials')

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    
    // Get current date for filename
    const date = new Date().toISOString().split('T')[0]
    saveAs(data, `material_costs_${date}.xlsx`)
  } catch (error) {
    console.error('Error exporting data:', error)
    alert('Terjadi kesalahan saat mengekspor data')
  } finally {
    isExporting.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadMaterials()
})
</script> 