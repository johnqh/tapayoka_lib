import { create } from 'zustand';
import type { Device } from '@sudobility/tapayoka_types';

interface DevicesState {
  devices: Device[];
  isLoaded: boolean;
  entitySlug: string | null;
  setDevices: (devices: Device[], entitySlug: string) => void;
  addDevice: (device: Device) => void;
  updateDevice: (walletAddress: string, updates: Partial<Device>) => void;
  removeDevice: (walletAddress: string) => void;
  reset: () => void;
}

export const useDevicesStore = create<DevicesState>(set => ({
  devices: [],
  isLoaded: false,
  entitySlug: null,
  setDevices: (devices, entitySlug) =>
    set({ devices, isLoaded: true, entitySlug }),
  addDevice: device =>
    set(state => ({ devices: [...state.devices, device] })),
  updateDevice: (walletAddress, updates) =>
    set(state => ({
      devices: state.devices.map(d =>
        d.walletAddress === walletAddress ? { ...d, ...updates } : d
      ),
    })),
  removeDevice: walletAddress =>
    set(state => ({
      devices: state.devices.filter(d => d.walletAddress !== walletAddress),
    })),
  reset: () => set({ devices: [], isLoaded: false, entitySlug: null }),
}));
