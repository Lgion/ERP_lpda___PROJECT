const API_URL = '/api/gestomag/arrivals';
const CACHE_KEY = 'gestomag_arrivals_cache';

export const arrivalService = {
  getAll: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch arrivals');
      const data = await response.json();
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      return data;
    } catch (error) {
      console.warn('API Error, falling back to local storage:', error);
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    }
  },

  create: async (arrival) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(arrival),
    });
    if (!response.ok) throw new Error('Failed to create arrival');
    return await response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete arrival');
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
