import { create } from 'zustand';
import type { VendorInstallation } from '@sudobility/tapayoka_types';

interface VendorInstallationsState {
  installations: VendorInstallation[];
  isLoaded: boolean;
  entitySlug: string | null;
  parentId: string | null;
  setInstallations: (
    installations: VendorInstallation[],
    parentId: string,
    entitySlug?: string
  ) => void;
  addInstallation: (installation: VendorInstallation) => void;
  updateInstallation: (
    id: string,
    updates: Partial<VendorInstallation>
  ) => void;
  removeInstallation: (id: string) => void;
  reset: () => void;
}

export const useVendorInstallationsStore = create<VendorInstallationsState>(
  set => ({
    installations: [],
    isLoaded: false,
    entitySlug: null,
    parentId: null,
    setInstallations: (installations, parentId, entitySlug) =>
      set({
        installations,
        isLoaded: true,
        parentId,
        entitySlug: entitySlug ?? null,
      }),
    addInstallation: installation =>
      set(state => ({ installations: [...state.installations, installation] })),
    updateInstallation: (id, updates) =>
      set(state => ({
        installations: state.installations.map(s =>
          s.id === id ? { ...s, ...updates } : s
        ),
      })),
    removeInstallation: id =>
      set(state => ({
        installations: state.installations.filter(s => s.id !== id),
      })),
    reset: () =>
      set({
        installations: [],
        isLoaded: false,
        entitySlug: null,
        parentId: null,
      }),
  })
);
