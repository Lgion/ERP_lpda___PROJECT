export interface Family {
    id?: number;
    code: string;
    label: string;
    image?: string;
    productCount?: number;
    _count?: {
        products: number;
    };
}

const API_URL = '/api/families';
const CACHE_KEY = 'gestomag_families_cache';

export const familyService = {
    getAll: async (): Promise<Family[]> => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch families');

            const data = await response.json();
            // Normalize _count to productCount
            const normalized = data.map((f: Family) => ({
                ...f,
                productCount: f._count?.products ?? 0
            }));
            localStorage.setItem(CACHE_KEY, JSON.stringify(normalized));
            return normalized;
        } catch (error) {
            console.warn('API Error, falling back to local storage:', error);
            const cached = localStorage.getItem(CACHE_KEY);
            return cached ? JSON.parse(cached) : [];
        }
    },

    create: async (family: Omit<Family, 'id'>): Promise<Family> => {
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
            list.push({ ...newFamily, productCount: 0 });
            localStorage.setItem(CACHE_KEY, JSON.stringify(list));
        }

        return newFamily;
    },

    update: async (id: number, family: Partial<Family>): Promise<Family> => {
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
            const idx = list.findIndex((f: Family) => f.id === id);
            if (idx !== -1) {
                list[idx] = { ...list[idx], ...updated };
                localStorage.setItem(CACHE_KEY, JSON.stringify(list));
            }
        }

        return updated;
    },

    delete: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete family');

        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const list = JSON.parse(cached).filter((f: Family) => f.id !== id);
            localStorage.setItem(CACHE_KEY, JSON.stringify(list));
        }
    },
};
