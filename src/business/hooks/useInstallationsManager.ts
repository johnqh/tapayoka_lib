import { useCallback, useEffect } from 'react';
import type { NetworkClient } from '@sudobility/types';
import type {
  InstallationCreateRequest,
  InstallationUpdateRequest,
} from '@sudobility/tapayoka_types';
import { useInstallations } from '@sudobility/tapayoka_client';
import { useInstallationsStore } from '../stores';
import type { FirebaseIdToken } from '@sudobility/tapayoka_client';

export const useInstallationsManager = (
  networkClient: NetworkClient,
  baseUrl: string,
  entitySlug: string | null,
  token: FirebaseIdToken | null
) => {
  const store = useInstallationsStore();
  const hook = useInstallations(networkClient, baseUrl, entitySlug, token);

  useEffect(() => {
    store.reset();
  }, [entitySlug]);

  useEffect(() => {
    if (hook.installations.length > 0 && entitySlug) {
      store.setInstallations(hook.installations, entitySlug);
    }
  }, [hook.installations, entitySlug]);

  const addInstallation = useCallback(
    async (data: InstallationCreateRequest) => {
      const svc = await hook.createInstallation(data);
      if (svc) store.addInstallation(svc);
      return svc;
    },
    [hook.createInstallation]
  );

  const updateInstallation = useCallback(
    async (id: string, data: InstallationUpdateRequest) => {
      const svc = await hook.updateInstallation(id, data);
      if (svc) store.updateInstallation(id, svc);
      return svc;
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
