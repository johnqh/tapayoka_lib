import { create } from 'zustand';
import type { VendorOffering } from '@sudobility/tapayoka_types';

interface VendorOfferingsState {
  offerings: VendorOffering[];
  isLoaded: boolean;
  entitySlug: string | null;
  parentId: string | null;
  setOfferings: (
    offerings: VendorOffering[],
    parentId: string,
    entitySlug?: string
  ) => void;
  addOffering: (offering: VendorOffering) => void;
  updateOffering: (id: string, updates: Partial<VendorOffering>) => void;
  removeOffering: (id: string) => void;
  reset: () => void;
}

export const useVendorOfferingsStore = create<VendorOfferingsState>(set => ({
  offerings: [],
  isLoaded: false,
  entitySlug: null,
  parentId: null,
  setOfferings: (offerings, parentId, entitySlug) =>
    set({
      offerings,
      isLoaded: true,
      parentId,
      entitySlug: entitySlug ?? null,
    }),
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
  reset: () =>
    set({
      offerings: [],
      isLoaded: false,
      entitySlug: null,
      parentId: null,
    }),
}));
