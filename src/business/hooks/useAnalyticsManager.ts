import { useEffect } from 'react';
import type { NetworkClient } from '@sudobility/types';
import { useAnalytics } from '@sudobility/tapayoka_client';
import { useAnalyticsStore } from '../stores';
import type { FirebaseIdToken } from '@sudobility/tapayoka_client';

export const useAnalyticsManager = (
  networkClient: NetworkClient,
  baseUrl: string,
  entitySlug: string | null,
  token: FirebaseIdToken | null,
  options?: { autoRefreshMs?: number }
) => {
  const store = useAnalyticsStore();
  const hook = useAnalytics(networkClient, baseUrl, entitySlug, token, options);

  useEffect(() => {
    if (hook.stats) {
      store.setStats(hook.stats);
    }
  }, [hook.stats]);

  return {
    stats: store.isLoaded ? store.stats : hook.stats,
    isLoading: hook.isLoading,
    error: hook.error,
    refresh: hook.refresh,
    clearError: hook.clearError,
  };
};
