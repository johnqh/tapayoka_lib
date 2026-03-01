import { create } from 'zustand';
import type { VendorServiceControl } from '@sudobility/tapayoka_types';

interface VendorServiceControlsState {
  controls: VendorServiceControl[];
  isLoaded: boolean;
  serviceId: string | null;
  setControls: (controls: VendorServiceControl[], serviceId: string) => void;
  addControl: (control: VendorServiceControl) => void;
  updateControl: (id: string, updates: Partial<VendorServiceControl>) => void;
  removeControl: (id: string) => void;
  reset: () => void;
}

export const useVendorServiceControlsStore =
  create<VendorServiceControlsState>(set => ({
    controls: [],
    isLoaded: false,
    serviceId: null,
    setControls: (controls, serviceId) =>
      set({ controls, isLoaded: true, serviceId }),
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
    reset: () => set({ controls: [], isLoaded: false, serviceId: null }),
  }));
