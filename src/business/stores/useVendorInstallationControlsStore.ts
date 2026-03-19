import { create } from 'zustand';
import type { VendorInstallationControl } from '@sudobility/tapayoka_types';

interface VendorInstallationControlsState {
  controls: VendorInstallationControl[];
  isLoaded: boolean;
  entitySlug: string | null;
  installationId: string | null;
  setControls: (
    controls: VendorInstallationControl[],
    installationId: string,
    entitySlug?: string
  ) => void;
  addControl: (control: VendorInstallationControl) => void;
  updateControl: (
    id: string,
    updates: Partial<VendorInstallationControl>
  ) => void;
  removeControl: (id: string) => void;
  reset: () => void;
}

export const useVendorInstallationControlsStore =
  create<VendorInstallationControlsState>(set => ({
    controls: [],
    isLoaded: false,
    entitySlug: null,
    installationId: null,
    setControls: (controls, installationId, entitySlug) =>
      set({
        controls,
        isLoaded: true,
        installationId,
        entitySlug: entitySlug ?? null,
      }),
    addControl: control =>
      set(state => ({ controls: [...state.controls, control] })),
    updateControl: (id, updates) =>
      set(state => ({
        controls: state.controls.map(c =>
          c.id === id ? { ...c, ...updates } : c
        ),
      })),
    removeControl: id =>
      set(state => ({
        controls: state.controls.filter(c => c.id !== id),
      })),
    reset: () =>
      set({
        controls: [],
        isLoaded: false,
        entitySlug: null,
        installationId: null,
      }),
  }));
