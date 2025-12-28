export interface ArrivalLine {
    id?: number;
    productId: number;
    product?: {
        id: number;
        ref: string;
        name: string;
    };
    quantity: number;
    unitPrice: number;
}

export interface Arrival {
    id?: number;
    date: string;
    reference: string;
    totalAmount: number;
    supplierId: number;
    supplier?: {
        id: number;
        name: string;
    };
    lines: ArrivalLine[];
    createdAt?: string;
}

const API_URL = '/api/arrivals';

export const arrivalService = {
    getAll: async (): Promise<Arrival[]> => {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch arrivals');
        return response.json();
    },

    getById: async (id: number): Promise<Arrival | null> => {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) return null;
            return response.json();
        } catch {
            return null;
        }
    },

    create: async (arrival: {
        date: string;
        reference: string;
        supplierId: number;
        lines: { productId: number; quantity: number; unitPrice: number }[];
    }): Promise<Arrival> => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(arrival),
        });
        if (!response.ok) throw new Error('Failed to create arrival');
        return response.json();
    },

    delete: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete arrival');
    },
};
