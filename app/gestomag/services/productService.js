const API_URL = '/api/gestomag/products';
const CACHE_KEY = 'gestomag_products_cache';

export const productService = {
  getAll: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      return data;
    } catch (error) {
      console.warn('API Error, falling back to local storage:', error);
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    }
  },

  create: async (product) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to create product');
    const newProduct = await response.json();

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const list = JSON.parse(cached);
      list.push(newProduct);
      localStorage.setItem(CACHE_KEY, JSON.stringify(list));
    }

    return newProduct;
  },

  update: async (id, product) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to update product');
    const updated = await response.json();

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const list = JSON.parse(cached);
      const idx = list.findIndex((p) => p.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updated };
        localStorage.setItem(CACHE_KEY, JSON.stringify(list));
      }
    }

    return updated;
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete product');

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const list = JSON.parse(cached).filter((p) => p.id !== id);
      localStorage.setItem(CACHE_KEY, JSON.stringify(list));
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
