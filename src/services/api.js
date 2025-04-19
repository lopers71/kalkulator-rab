const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const api = {
  // Material
  async getMaterials() {
    const response = await fetch(`${API_URL}/material_costs`)
    return response.json()
  },

  async getMaterial(id) {
    const response = await fetch(`${API_URL}/material_costs/${id}`)
    return response.json()
  },

  async createMaterial(material) {
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
    return response.json()
  },

  async updateMaterial(id, material) {
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
    return response.json()
  },

  // Price History
  async getPriceHistory(materialId, startDate) {
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
    return response.json()
  },

  async createPriceHistory(priceHistory) {
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
    return response.json()
  },

  // Utility function untuk generate ID
  generateId() {
    return Date.now().toString()
  }
} 