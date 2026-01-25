const API_URL = '/api/gestomag/families';
const CACHE_KEY = 'gestomag_families_cache';

export const familyService = {
  getAll: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch families');
      const data = await response.json();
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      return data;
    } catch (error) {
      console.warn('API Error, falling back to local storage:', error);
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    }
  },

  create: async (family) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(family),
    });
    if (!response.ok) throw new Error('Failed to create family');
    const newFamily = await response.json();

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const list = JSON.parse(cached);
      list.push(newFamily);
      localStorage.setItem(CACHE_KEY, JSON.stringify(list));
    }

    return newFamily;
  },

  update: async (id, family) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(family),
    });
    if (!response.ok) throw new Error('Failed to update family');
    const updated = await response.json();

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const list = JSON.parse(cached);
      const idx = list.findIndex((f) => f.id === id);
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
    if (!response.ok) throw new Error('Failed to delete family');

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const list = JSON.parse(cached).filter((f) => f.id !== id);
      localStorage.setItem(CACHE_KEY, JSON.stringify(list));
    }
  },
};
