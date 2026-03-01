import { create } from 'zustand';
import type { VendorService } from '@sudobility/tapayoka_types';

interface VendorServicesState {
  services: VendorService[];
  isLoaded: boolean;
  parentId: string | null;
  setServices: (services: VendorService[], parentId: string) => void;
  addService: (service: VendorService) => void;
  updateService: (id: string, updates: Partial<VendorService>) => void;
  removeService: (id: string) => void;
  reset: () => void;
}

export const useVendorServicesStore = create<VendorServicesState>(set => ({
  services: [],
  isLoaded: false,
  parentId: null,
  setServices: (services, parentId) =>
    set({ services, isLoaded: true, parentId }),
  addService: service =>
    set(state => ({ services: [...state.services, service] })),
  updateService: (id, updates) =>
    set(state => ({
      services: state.services.map(s =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),
  removeService: id =>
    set(state => ({
      services: state.services.filter(s => s.id !== id),
    })),
  reset: () => set({ services: [], isLoaded: false, parentId: null }),
}));
