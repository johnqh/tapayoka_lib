import { create } from 'zustand';
import type { VendorLocation } from '@sudobility/tapayoka_types';

interface VendorLocationsState {
  locations: VendorLocation[];
  isLoaded: boolean;
  setLocations: (locations: VendorLocation[]) => void;
  addLocation: (location: VendorLocation) => void;
  updateLocation: (id: string, updates: Partial<VendorLocation>) => void;
  removeLocation: (id: string) => void;
  reset: () => void;
}

export const useVendorLocationsStore = create<VendorLocationsState>(set => ({
  locations: [],
  isLoaded: false,
  setLocations: locations => set({ locations, isLoaded: true }),
  addLocation: location =>
    set(state => ({ locations: [...state.locations, location] })),
  updateLocation: (id, updates) =>
    set(state => ({
      locations: state.locations.map(l =>
        l.id === id ? { ...l, ...updates } : l
      ),
    })),
  removeLocation: id =>
    set(state => ({
      locations: state.locations.filter(l => l.id !== id),
    })),
  reset: () => set({ locations: [], isLoaded: false }),
}));
