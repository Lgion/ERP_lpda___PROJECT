const API_URL = '/api/gestomag/suppliers';
const CACHE_KEY = 'gestomag_suppliers_cache';

export const supplierService = {
  getAll: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch suppliers');
      const data = await response.json();
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      return data;
    } catch (error) {
      console.warn('API Error, falling back to local storage:', error);
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    }
  },

  create: async (supplier) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supplier),
    });
    if (!response.ok) throw new Error('Failed to create supplier');
    return await response.json();
  },

  update: async (id, supplier) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supplier),
    });
    if (!response.ok) throw new Error('Failed to update supplier');
    return await response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete supplier');
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  },
};
