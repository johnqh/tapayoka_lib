import { describe, it, expect, beforeEach } from 'vitest';
import { useAnalyticsStore } from '../business/stores/useAnalyticsStore';
import type { DashboardStats } from '@sudobility/tapayoka_types';

const mockStats: DashboardStats = {
  totalDevices: 5,
  activeDevices: 3,
  totalOrders: 100,
  activeOrders: 2,
  revenueTodayCents: 5000,
  revenueThisWeekCents: 25000,
  successRate: 0.95,
};

describe('useAnalyticsStore', () => {
  beforeEach(() => {
    useAnalyticsStore.getState().reset();
  });

  it('starts with null stats', () => {
    const state = useAnalyticsStore.getState();
    expect(state.stats).toBeNull();
    expect(state.isLoaded).toBe(false);
  });

  it('setStats stores stats and marks loaded', () => {
    useAnalyticsStore.getState().setStats(mockStats);
    const state = useAnalyticsStore.getState();
    expect(state.stats).toEqual(mockStats);
    expect(state.isLoaded).toBe(true);
  });

  it('reset clears stats', () => {
    useAnalyticsStore.getState().setStats(mockStats);
    useAnalyticsStore.getState().reset();
    const state = useAnalyticsStore.getState();
    expect(state.stats).toBeNull();
    expect(state.isLoaded).toBe(false);
  });
});
