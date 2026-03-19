import { create } from 'zustand';
import type { VendorModel } from '@sudobility/tapayoka_types';

interface VendorModelsState {
  models: VendorModel[];
  isLoaded: boolean;
  entitySlug: string | null;
  setModels: (models: VendorModel[], entitySlug?: string) => void;
  addModel: (model: VendorModel) => void;
  updateModel: (id: string, updates: Partial<VendorModel>) => void;
  removeModel: (id: string) => void;
  reset: () => void;
}

export const useVendorModelsStore = create<VendorModelsState>(set => ({
  models: [],
  isLoaded: false,
  entitySlug: null,
  setModels: (models, entitySlug) =>
    set({ models, isLoaded: true, entitySlug: entitySlug ?? null }),
  addModel: model => set(state => ({ models: [...state.models, model] })),
  updateModel: (id, updates) =>
    set(state => ({
      models: state.models.map(c => (c.id === id ? { ...c, ...updates } : c)),
    })),
  removeModel: id =>
    set(state => ({
      models: state.models.filter(c => c.id !== id),
    })),
  reset: () => set({ models: [], isLoaded: false, entitySlug: null }),
}));
