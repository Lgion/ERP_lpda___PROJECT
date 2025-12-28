export interface Product {
    id?: number;
    ref: string;
    name: string;
    familyId?: number;
    family?: {
        id: number;
        code: string;
        label: string;
        image?: string;
    };
    price: number;
    stock: number;
    minStock: number;
    vat: number;
    status: 'available' | 'out_of_stock';
    image?: string;
    cloudinaryId?: string;
}

const API_URL = '/api/products';
const CACHE_KEY = 'gestomag_products_cache';

export const productService = {
    // Get all products with Cache-First or Network-First strategy
    // Here: Network-First with Fallback
    getAll: async (): Promise<Product[]> => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch products');

            const data = await response.json();
            // Update Cache
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            return data;
        } catch (error) {
            console.warn('API Error, falling back to local storage:', error);
            // Fallback to cache
            const cached = localStorage.getItem(CACHE_KEY);
            return cached ? JSON.parse(cached) : [];
        }
    },

    // Create product
    create: async (product: Omit<Product, 'id'>): Promise<Product> => {
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

    // Update product
    update: async (id: number, product: Partial<Product>): Promise<Product> => {
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
            const idx = list.findIndex((p: Product) => p.id === id);
            if (idx !== -1) {
                list[idx] = { ...list[idx], ...updated };
                localStorage.setItem(CACHE_KEY, JSON.stringify(list));
            }
        }

        return updated;
    },

    // Delete product
    delete: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete product');

        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const list = JSON.parse(cached).filter((p: Product) => p.id !== id);
            localStorage.setItem(CACHE_KEY, JSON.stringify(list));
        }
    },

    // Get single product by ID
    getById: async (id: number): Promise<Product | null> => {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) return null;
            return await response.json();
        } catch {
            return null;
        }
    },
};
