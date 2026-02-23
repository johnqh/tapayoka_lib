import { create } from 'zustand';
import type { Service } from '@sudobility/tapayoka_types';

interface ServicesState {
  services: Service[];
  isLoaded: boolean;
  entitySlug: string | null;
  setServices: (services: Service[], entitySlug: string) => void;
  addService: (service: Service) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  removeService: (id: string) => void;
  reset: () => void;
}

export const useServicesStore = create<ServicesState>(set => ({
  services: [],
  isLoaded: false,
  entitySlug: null,
  setServices: (services, entitySlug) =>
    set({ services, isLoaded: true, entitySlug }),
  addService: service =>
    set(state => ({ services: [...state.services, service] })),
  updateService: (id, updates) =>
    set(state => ({
      services: state.services.map(s => (s.id === id ? { ...s, ...updates } : s)),
    })),
  removeService: id =>
    set(state => ({ services: state.services.filter(s => s.id !== id) })),
  reset: () => set({ services: [], isLoaded: false, entitySlug: null }),
}));
