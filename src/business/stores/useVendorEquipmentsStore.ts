import { create } from 'zustand';
import type { VendorEquipment } from '@sudobility/tapayoka_types';

interface VendorEquipmentsState {
  equipments: VendorEquipment[];
  isLoaded: boolean;
  entitySlug: string | null;
  serviceId: string | null;
  setEquipments: (equipments: VendorEquipment[], serviceId: string, entitySlug?: string) => void;
  addEquipment: (equipment: VendorEquipment) => void;
  updateEquipment: (walletAddress: string, updates: Partial<VendorEquipment>) => void;
  removeEquipment: (walletAddress: string) => void;
  reset: () => void;
}

export const useVendorEquipmentsStore = create<VendorEquipmentsState>(
  set => ({
    equipments: [],
    isLoaded: false,
    entitySlug: null,
    serviceId: null,
    setEquipments: (equipments, serviceId, entitySlug) =>
      set({ equipments, isLoaded: true, serviceId, entitySlug: entitySlug ?? null }),
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
    reset: () => set({ equipments: [], isLoaded: false, entitySlug: null, serviceId: null }),
  })
);
