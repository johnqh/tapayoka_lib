import { create } from 'zustand';
import type { VendorInstallation } from '@sudobility/tapayoka_types';

interface VendorInstallationsState {
  installations: VendorInstallation[];
  isLoaded: boolean;
  entitySlug: string | null;
  offeringId: string | null;
  setInstallations: (
    installations: VendorInstallation[],
    offeringId: string,
    entitySlug?: string
  ) => void;
  addInstallation: (installation: VendorInstallation) => void;
  updateInstallation: (
    walletAddress: string,
    updates: Partial<VendorInstallation>
  ) => void;
  removeInstallation: (walletAddress: string) => void;
  reset: () => void;
}

export const useVendorInstallationsStore = create<VendorInstallationsState>(
  set => ({
    installations: [],
    isLoaded: false,
    entitySlug: null,
    offeringId: null,
    setInstallations: (installations, offeringId, entitySlug) =>
      set({
        installations,
        isLoaded: true,
        offeringId,
        entitySlug: entitySlug ?? null,
      }),
    addInstallation: installation =>
      set(state => ({ installations: [...state.installations, installation] })),
    updateInstallation: (walletAddress, updates) =>
      set(state => ({
        installations: state.installations.map(e =>
          e.walletAddress === walletAddress ? { ...e, ...updates } : e
        ),
      })),
    removeInstallation: walletAddress =>
      set(state => ({
        installations: state.installations.filter(
          e => e.walletAddress !== walletAddress
        ),
      })),
    reset: () =>
      set({
        installations: [],
        isLoaded: false,
        entitySlug: null,
        offeringId: null,
      }),
  })
);
