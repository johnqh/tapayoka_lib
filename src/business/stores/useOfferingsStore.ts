import { create } from 'zustand';
import type { Offering } from '@sudobility/tapayoka_types';

interface OfferingsState {
  offerings: Offering[];
  isLoaded: boolean;
  entitySlug: string | null;
  setOfferings: (offerings: Offering[], entitySlug: string) => void;
  addOffering: (offering: Offering) => void;
  updateOffering: (id: string, updates: Partial<Offering>) => void;
  removeOffering: (id: string) => void;
  reset: () => void;
}

export const useOfferingsStore = create<OfferingsState>(set => ({
  offerings: [],
  isLoaded: false,
  entitySlug: null,
  setOfferings: (offerings, entitySlug) =>
    set({ offerings, isLoaded: true, entitySlug }),
  addOffering: offering =>
    set(state => ({ offerings: [...state.offerings, offering] })),
  updateOffering: (id, updates) =>
    set(state => ({
      offerings: state.offerings.map(s =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),
  removeOffering: id =>
    set(state => ({
      offerings: state.offerings.filter(s => s.id !== id),
    })),
  reset: () => set({ offerings: [], isLoaded: false, entitySlug: null }),
}));
