export interface Client {
    id?: number;
    name: string;
    type: string;
    phone?: string;
    city?: string;
    createdAt?: string;
}

const API_URL = '/api/clients';

export const clientService = {
    getAll: async (): Promise<Client[]> => {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch clients');
        return response.json();
    },

    getById: async (id: number): Promise<Client | null> => {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) return null;
            return response.json();
        } catch {
            return null;
        }
    },

    create: async (client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(client),
        });
        if (!response.ok) throw new Error('Failed to create client');
        return response.json();
    },

    update: async (id: number, client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(client),
        });
        if (!response.ok) throw new Error('Failed to update client');
        return response.json();
    },

    delete: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete client');
    },
};
