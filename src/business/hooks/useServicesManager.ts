import { useCallback, useEffect } from 'react';
import type { NetworkClient } from '@sudobility/types';
import type { ServiceCreateRequest, ServiceUpdateRequest } from '@sudobility/tapayoka_types';
import { useServices } from '@sudobility/tapayoka_client';
import { useServicesStore } from '../stores';
import type { FirebaseIdToken } from '@sudobility/tapayoka_client';

export const useServicesManager = (
  networkClient: NetworkClient,
  baseUrl: string,
  entitySlug: string | null,
  token: FirebaseIdToken | null
) => {
  const store = useServicesStore();
  const hook = useServices(networkClient, baseUrl, entitySlug, token);

  useEffect(() => {
    if (hook.services.length > 0 && entitySlug) {
      store.setServices(hook.services, entitySlug);
    }
  }, [hook.services, entitySlug]);

  const addService = useCallback(
    async (data: ServiceCreateRequest) => {
      const svc = await hook.createService(data);
      if (svc) store.addService(svc);
      return svc;
    },
    [hook.createService]
  );

  const updateService = useCallback(
    async (id: string, data: ServiceUpdateRequest) => {
      const svc = await hook.updateService(id, data);
      if (svc) store.updateService(id, svc);
      return svc;
    },
    [hook.updateService]
  );

  const deleteService = useCallback(
    async (id: string) => {
      const ok = await hook.deleteService(id);
      if (ok) store.removeService(id);
      return ok;
    },
    [hook.deleteService]
  );

  return {
    services: store.isLoaded ? store.services : hook.services,
    isLoading: hook.isLoading,
    error: hook.error,
    refresh: hook.refresh,
    addService,
    updateService,
    deleteService,
    clearError: hook.clearError,
  };
};
