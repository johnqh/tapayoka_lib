import { useCallback, useEffect } from 'react';
import type { NetworkClient } from '@sudobility/types';
import type {
  OfferingCreateRequest,
  OfferingUpdateRequest,
} from '@sudobility/tapayoka_types';
import { useOfferings } from '@sudobility/tapayoka_client';
import { useOfferingsStore } from '../stores';
import type { FirebaseIdToken } from '@sudobility/tapayoka_client';

export const useOfferingsManager = (
  networkClient: NetworkClient,
  baseUrl: string,
  entitySlug: string | null,
  token: FirebaseIdToken | null
) => {
  const store = useOfferingsStore();
  const hook = useOfferings(networkClient, baseUrl, entitySlug, token);

  useEffect(() => {
    store.reset();
  }, [entitySlug]);

  useEffect(() => {
    if (hook.offerings.length > 0 && entitySlug) {
      store.setOfferings(hook.offerings, entitySlug);
    }
  }, [hook.offerings, entitySlug]);

  const addOffering = useCallback(
    async (data: OfferingCreateRequest) => {
      const svc = await hook.createOffering(data);
      if (svc) store.addOffering(svc);
      return svc;
    },
    [hook.createOffering]
  );

  const updateOffering = useCallback(
    async (id: string, data: OfferingUpdateRequest) => {
      const svc = await hook.updateOffering(id, data);
      if (svc) store.updateOffering(id, svc);
      return svc;
    },
    [hook.updateOffering]
  );

  const deleteOffering = useCallback(
    async (id: string) => {
      const ok = await hook.deleteOffering(id);
      if (ok) store.removeOffering(id);
      return ok;
    },
    [hook.deleteOffering]
  );

  return {
    offerings: store.isLoaded ? store.offerings : hook.offerings,
    isLoading: hook.isLoading,
    error: hook.error,
    refresh: hook.refresh,
    addOffering,
    updateOffering,
    deleteOffering,
    clearError: hook.clearError,
  };
};
