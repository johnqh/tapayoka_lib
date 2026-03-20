import { useCallback, useEffect } from 'react';
import type { NetworkClient } from '@sudobility/types';
import type {
  VendorOfferingCreateRequest,
  VendorOfferingUpdateRequest,
} from '@sudobility/tapayoka_types';
import { useVendorOfferings } from '@sudobility/tapayoka_client';
import { useVendorOfferingsStore } from '../stores';
import type { FirebaseIdToken } from '@sudobility/tapayoka_client';

export const useVendorOfferingsManager = (
  networkClient: NetworkClient,
  baseUrl: string,
  entitySlug: string | null,
  token: FirebaseIdToken | null,
  parentId: string | null,
  parentType: 'location' | 'model'
) => {
  const store = useVendorOfferingsStore();
  const hook = useVendorOfferings(
    networkClient,
    baseUrl,
    entitySlug,
    token,
    parentId,
    parentType,
    { enabled: !!token && !!parentId }
  );

  useEffect(() => {
    store.reset();
  }, [entitySlug]);

  useEffect(() => {
    if (hook.offerings.length > 0 && parentId) {
      store.setOfferings(hook.offerings, parentId, entitySlug ?? undefined);
    }
  }, [hook.offerings, parentId, entitySlug]);

  const addOffering = useCallback(
    async (data: VendorOfferingCreateRequest) => {
      const offering = await hook.createOffering(data);
      if (offering) store.addOffering(offering);
      return offering;
    },
    [hook.createOffering]
  );

  const updateOffering = useCallback(
    async (id: string, data: VendorOfferingUpdateRequest) => {
      const offering = await hook.updateOffering(id, data);
      if (offering) store.updateOffering(id, offering);
      return offering;
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
