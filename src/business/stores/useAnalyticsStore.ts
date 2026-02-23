import { create } from 'zustand';
import type { DashboardStats } from '@sudobility/tapayoka_types';

interface AnalyticsState {
  stats: DashboardStats | null;
  isLoaded: boolean;
  setStats: (stats: DashboardStats) => void;
  reset: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>(set => ({
  stats: null,
  isLoaded: false,
  setStats: stats => set({ stats, isLoaded: true }),
  reset: () => set({ stats: null, isLoaded: false }),
}));
