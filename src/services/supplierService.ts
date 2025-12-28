export interface Supplier {
    id?: number;
    name: string;
    contact?: string;
    phone?: string;
    email?: string;
    city?: string;
    createdAt?: string;
}

const API_URL = '/api/suppliers';

export const supplierService = {
    getAll: async (): Promise<Supplier[]> => {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch suppliers');
        return response.json();
    },

    getById: async (id: number): Promise<Supplier | null> => {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) return null;
            return response.json();
        } catch {
            return null;
        }
    },

    create: async (supplier: Omit<Supplier, 'id' | 'createdAt'>): Promise<Supplier> => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(supplier),
        });
        if (!response.ok) throw new Error('Failed to create supplier');
        return response.json();
    },

    update: async (id: number, supplier: Omit<Supplier, 'id' | 'createdAt'>): Promise<Supplier> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(supplier),
        });
        if (!response.ok) throw new Error('Failed to update supplier');
        return response.json();
    },

    delete: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to delete supplier');
        }
    },
};
