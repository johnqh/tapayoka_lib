import { create } from 'zustand';
import type { VendorEquipmentCategory } from '@sudobility/tapayoka_types';

interface VendorEquipmentCategoriesState {
  categories: VendorEquipmentCategory[];
  isLoaded: boolean;
  setCategories: (categories: VendorEquipmentCategory[]) => void;
  addCategory: (category: VendorEquipmentCategory) => void;
  updateCategory: (id: string, updates: Partial<VendorEquipmentCategory>) => void;
  removeCategory: (id: string) => void;
  reset: () => void;
}

export const useVendorEquipmentCategoriesStore =
  create<VendorEquipmentCategoriesState>(set => ({
    categories: [],
    isLoaded: false,
    setCategories: categories => set({ categories, isLoaded: true }),
    addCategory: category =>
      set(state => ({ categories: [...state.categories, category] })),
    updateCategory: (id, updates) =>
      set(state => ({
        categories: state.categories.map(c =>
          c.id === id ? { ...c, ...updates } : c
        ),
      })),
    removeCategory: id =>
      set(state => ({
        categories: state.categories.filter(c => c.id !== id),
      })),
    reset: () => set({ categories: [], isLoaded: false }),
  }));
