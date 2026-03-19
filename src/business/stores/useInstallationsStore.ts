import { create } from 'zustand';
import type { Installation } from '@sudobility/tapayoka_types';

interface InstallationsState {
  installations: Installation[];
  isLoaded: boolean;
  entitySlug: string | null;
  setInstallations: (installations: Installation[], entitySlug: string) => void;
  addInstallation: (installation: Installation) => void;
  updateInstallation: (id: string, updates: Partial<Installation>) => void;
  removeInstallation: (id: string) => void;
  reset: () => void;
}

export const useInstallationsStore = create<InstallationsState>(set => ({
  installations: [],
  isLoaded: false,
  entitySlug: null,
  setInstallations: (installations, entitySlug) =>
    set({ installations, isLoaded: true, entitySlug }),
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
  reset: () => set({ installations: [], isLoaded: false, entitySlug: null }),
}));
