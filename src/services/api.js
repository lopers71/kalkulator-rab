// API URL akan sama dengan frontend URL di production
const API_URL = import.meta.env.DEV ? 'http://localhost:3001' : window.location.origin

export const api = {
  // Material
  async getMaterials() {
    try {
      const response = await fetch(`${API_URL}/material_costs`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    } catch (error) {
      console.error('Error fetching materials:', error)
      throw new Error('Gagal memuat data material')
    }
  },

  async getMaterial(id) {
    try {
      const response = await fetch(`${API_URL}/material_costs/${id}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    } catch (error) {
      console.error('Error fetching material:', error)
      throw new Error('Gagal memuat detail material')
    }
  },

  async createMaterial(material) {
    try {
      const response = await fetch(`${API_URL}/material_costs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...material,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    } catch (error) {
      console.error('Error creating material:', error)
      throw new Error('Gagal membuat material baru')
    }
  },

  async updateMaterial(id, material) {
    try {
      const response = await fetch(`${API_URL}/material_costs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...material,
          updated_at: new Date().toISOString(),
        }),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    } catch (error) {
      console.error('Error updating material:', error)
      throw new Error('Gagal mengupdate material')
    }
  },

  // Price History
  async getPriceHistory(materialId, startDate) {
    try {
      const query = new URLSearchParams()
      
      if (materialId) {
        query.append('material_id', materialId)
      }
      
      query.append('_sort', 'created_at')
      query.append('_order', 'asc')
      
      if (startDate) {
        query.append('created_at_gte', startDate.toISOString())
      }
      
      const response = await fetch(`${API_URL}/price_history?${query}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    } catch (error) {
      console.error('Error fetching price history:', error)
      throw new Error('Gagal memuat riwayat harga')
    }
  },

  async createPriceHistory(priceHistory) {
    try {
      const response = await fetch(`${API_URL}/price_history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...priceHistory,
          created_at: new Date().toISOString(),
        }),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    } catch (error) {
      console.error('Error creating price history:', error)
      throw new Error('Gagal mencatat perubahan harga')
    }
  },

  // Utility function untuk generate ID
  generateId() {
    return Date.now().toString()
  }
} 