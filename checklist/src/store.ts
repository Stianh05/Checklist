import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppState, Product, ViewMode } from './types';

interface StoreActions {
  init: () => (() => void);
  setViewMode: (mode: ViewMode) => void;
  adjustQuantity: (productId: string, amount: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  toggleComplete: (productId: string) => Promise<void>;
  resetQuantity: (productId: string) => Promise<void>;
  wipeSide: () => Promise<void>;
  updateProduct: (productId: string, name: string) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  addProduct: (name: string) => Promise<void>;
  seedProducts: () => Promise<void>;
  clearError: () => void;
}

const INITIAL_PRODUCTS: Product[] = [];

export const useStore = create<AppState & StoreActions>()(
  persist(
    (set, get) => ({
      products: INITIAL_PRODUCTS,
      items: {},
      viewMode: 'list',
      loading: false,
      error: null,
      clearError: () => set({ error: null }),

      init: () => {
        // Local state doesn't need external listeners
        return () => {};
      },

      setViewMode: (viewMode) => set({ viewMode }),

      adjustQuantity: async (productId, amount) => {
        const { items } = get();
        const current = items[productId] || { quantity: 0, completed: false };
        const newQty = Math.max(0, current.quantity + amount);
        
        set({
          items: {
            ...items,
            [productId]: { ...current, quantity: newQty, completed: false }
          }
        });
      },

      updateQuantity: async (productId, quantity) => {
        const { items } = get();
        const current = items[productId] || { quantity: 0, completed: false };
        const newQty = Math.max(0, quantity);
        
        set({
          items: {
            ...items,
            [productId]: { ...current, quantity: newQty, completed: false }
          }
        });
      },

      toggleComplete: async (productId) => {
        const { items } = get();
        const current = items[productId] || { quantity: 0, completed: false };
        set({
          items: {
            ...items,
            [productId]: { ...current, completed: !current.completed }
          }
        });
      },

      resetQuantity: async (productId) => {
        const { items } = get();
        set({
          items: {
            ...items,
            [productId]: { quantity: 0, completed: false }
          }
        });
      },

      seedProducts: async () => {
        // In local mode, products are pre-seeded in initial state
      },

      wipeSide: async () => {
        const { items } = get();
        const newItems = { ...items };
        Object.keys(newItems).forEach(id => {
          newItems[id] = { quantity: 0, completed: false };
        });
        set({ items: newItems });
      },

      updateProduct: async (productId, name) => {
        const { products } = get();
        set({
          products: products.map(p => p.id === productId ? { ...p, name } : p)
        });
      },

      deleteProduct: async (productId) => {
        const { products, items } = get();
        const newItems = { ...items };
        delete newItems[productId];
        set({
          products: products.filter(p => p.id !== productId),
          items: newItems
        });
      },

      addProduct: async (name) => {
        const { products } = get();
        const newProduct: Product = {
          id: Math.random().toString(36).substring(2, 9),
          name,
          category: 'Default',
          active: true,
          sortOrder: products.length + 1
        };
        set({ products: [...products, newProduct] });
      }
    }),
    {
      name: 'drink-restock-storage-v4',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
