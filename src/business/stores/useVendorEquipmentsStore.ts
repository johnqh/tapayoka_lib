import { create } from 'zustand';
import type { VendorEquipment } from '@sudobility/tapayoka_types';

interface VendorEquipmentsState {
  equipments: VendorEquipment[];
  isLoaded: boolean;
  entitySlug: string | null;
  offeringId: string | null;
  setEquipments: (
    equipments: VendorEquipment[],
    offeringId: string,
    entitySlug?: string
  ) => void;
  addEquipment: (equipment: VendorEquipment) => void;
  updateEquipment: (
    walletAddress: string,
    updates: Partial<VendorEquipment>
  ) => void;
  removeEquipment: (walletAddress: string) => void;
  reset: () => void;
}

export const useVendorEquipmentsStore = create<VendorEquipmentsState>(set => ({
  equipments: [],
  isLoaded: false,
  entitySlug: null,
  offeringId: null,
  setEquipments: (equipments, offeringId, entitySlug) =>
    set({
      equipments,
      isLoaded: true,
      offeringId,
      entitySlug: entitySlug ?? null,
    }),
  addEquipment: equipment =>
    set(state => ({ equipments: [...state.equipments, equipment] })),
  updateEquipment: (walletAddress, updates) =>
    set(state => ({
      equipments: state.equipments.map(e =>
        e.walletAddress === walletAddress ? { ...e, ...updates } : e
      ),
    })),
  removeEquipment: walletAddress =>
    set(state => ({
      equipments: state.equipments.filter(
        e => e.walletAddress !== walletAddress
      ),
    })),
  reset: () =>
    set({
      equipments: [],
      isLoaded: false,
      entitySlug: null,
      offeringId: null,
    }),
}));
