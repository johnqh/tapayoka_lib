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
  parentId: string | null,
  parentType: 'location' | 'model'
) => {
  const store = useVendorInstallationsStore();
  const hook = useVendorInstallations(
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
    if (hook.installations.length > 0 && parentId) {
      store.setInstallations(hook.installations, parentId, entitySlug ?? undefined);
    }
  }, [hook.installations, parentId, entitySlug]);

  const addInstallation = useCallback(
    async (data: VendorInstallationCreateRequest) => {
      const installation = await hook.createInstallation(data);
      if (installation) store.addInstallation(installation);
      return installation;
    },
    [hook.createInstallation]
  );

  const updateInstallation = useCallback(
    async (id: string, data: VendorInstallationUpdateRequest) => {
      const installation = await hook.updateInstallation(id, data);
      if (installation) store.updateInstallation(id, installation);
      return installation;
    },
    [hook.updateInstallation]
  );

  const deleteInstallation = useCallback(
    async (id: string) => {
      const ok = await hook.deleteInstallation(id);
      if (ok) store.removeInstallation(id);
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
