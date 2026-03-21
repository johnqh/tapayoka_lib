import { create } from 'zustand';
import type { VendorInstallationSlot } from '@sudobility/tapayoka_types';

interface VendorInstallationSlotsState {
  slots: VendorInstallationSlot[];
  isLoaded: boolean;
  installationWalletAddress: string | null;
  setSlots: (
    slots: VendorInstallationSlot[],
    installationWalletAddress: string
  ) => void;
  addSlot: (slot: VendorInstallationSlot) => void;
  addSlots: (slots: VendorInstallationSlot[]) => void;
  updateSlot: (
    slotId: string,
    updates: Partial<VendorInstallationSlot>
  ) => void;
  removeSlot: (slotId: string) => void;
  clearSlots: () => void;
  reset: () => void;
}

export const useVendorInstallationSlotsStore =
  create<VendorInstallationSlotsState>(set => ({
    slots: [],
    isLoaded: false,
    installationWalletAddress: null,
    setSlots: (slots, installationWalletAddress) =>
      set({ slots, isLoaded: true, installationWalletAddress }),
    addSlot: slot => set(state => ({ slots: [...state.slots, slot] })),
    addSlots: slots => set(state => ({ slots: [...state.slots, ...slots] })),
    updateSlot: (slotId, updates) =>
      set(state => ({
        slots: state.slots.map(s =>
          s.id === slotId ? { ...s, ...updates } : s
        ),
      })),
    removeSlot: slotId =>
      set(state => ({
        slots: state.slots.filter(s => s.id !== slotId),
      })),
    clearSlots: () => set({ slots: [] }),
    reset: () =>
      set({
        slots: [],
        isLoaded: false,
        installationWalletAddress: null,
      }),
  }));
