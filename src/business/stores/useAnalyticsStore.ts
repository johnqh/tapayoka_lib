import { create } from 'zustand';
import type { DashboardStats } from '@sudobility/tapayoka_types';

interface AnalyticsState {
  stats: DashboardStats | null;
  isLoaded: boolean;
  entitySlug: string | null;
  setStats: (stats: DashboardStats, entitySlug?: string) => void;
  reset: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>(set => ({
  stats: null,
  isLoaded: false,
  entitySlug: null,
  setStats: (stats, entitySlug) =>
    set({ stats, isLoaded: true, entitySlug: entitySlug ?? null }),
  reset: () => set({ stats: null, isLoaded: false, entitySlug: null }),
}));
