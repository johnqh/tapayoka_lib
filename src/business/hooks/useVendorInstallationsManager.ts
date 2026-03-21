import { useCallback, useEffect } from 'react';
import type { NetworkClient } from '@sudobility/types';
import type {
  VendorInstallationCreateRequest,
  VendorInstallationUpdateRequest,
} from '@sudobility/tapayoka_types';
import { useVendorInstallations } from '@sudobility/tapayoka_client';
import { useVendorInstallationsStore } from '../stores';
import type { FirebaseIdToken } from '@sudobility/tapayoka_client';

export const useVendorInstallationsManager = (
  networkClient: NetworkClient,
  baseUrl: string,
  entitySlug: string | null,
  token: FirebaseIdToken | null,
  offeringId: string | null
) => {
  const store = useVendorInstallationsStore();
  const hook = useVendorInstallations(
    networkClient,
    baseUrl,
    entitySlug,
    token,
    offeringId,
    { enabled: !!token && !!offeringId }
  );

  useEffect(() => {
    store.reset();
  }, [entitySlug]);

  useEffect(() => {
    if (hook.installations.length > 0 && offeringId) {
      store.setInstallations(
        hook.installations,
        offeringId,
        entitySlug ?? undefined
      );
    }
  }, [hook.installations, offeringId, entitySlug]);

  const addInstallation = useCallback(
    async (data: VendorInstallationCreateRequest) => {
      const installation = await hook.createInstallation(data);
      if (installation) store.addInstallation(installation);
      return installation;
    },
    [hook.createInstallation]
  );

  const updateInstallation = useCallback(
    async (walletAddress: string, data: VendorInstallationUpdateRequest) => {
      const installation = await hook.updateInstallation(walletAddress, data);
      if (installation) store.updateInstallation(walletAddress, installation);
      return installation;
    },
    [hook.updateInstallation]
  );

  const deleteInstallation = useCallback(
    async (walletAddress: string) => {
      const ok = await hook.deleteInstallation(walletAddress);
      if (ok) store.removeInstallation(walletAddress);
      return ok;
    },
    [hook.deleteInstallation]
  );

  return {
    installations: store.isLoaded ? store.installations : hook.installations,
    isLoading: hook.isLoading,
    error: hook.error,
    refresh: hook.refresh,
    addInstallation,
    updateInstallation,
    deleteInstallation,
    clearError: hook.clearError,
  };
};
