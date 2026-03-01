import { useCallback, useEffect } from 'react';
import type { NetworkClient } from '@sudobility/types';
import type {
  VendorServiceCreateRequest,
  VendorServiceUpdateRequest,
} from '@sudobility/tapayoka_types';
import { useVendorServices } from '@sudobility/tapayoka_client';
import { useVendorServicesStore } from '../stores';
import type { FirebaseIdToken } from '@sudobility/tapayoka_client';

export const useVendorServicesManager = (
  networkClient: NetworkClient,
  baseUrl: string,
  entitySlug: string | null,
  token: FirebaseIdToken | null,
  parentId: string | null,
  parentType: 'location' | 'category'
) => {
  const store = useVendorServicesStore();
  const hook = useVendorServices(
    networkClient,
    baseUrl,
    entitySlug,
    token,
    parentId,
    parentType,
    { enabled: !!token && !!parentId }
  );

  useEffect(() => {
    if (hook.services.length > 0 && parentId) {
      store.setServices(hook.services, parentId);
    }
  }, [hook.services, parentId]);

  const addService = useCallback(
    async (data: VendorServiceCreateRequest) => {
      const service = await hook.createService(data);
      if (service) store.addService(service);
      return service;
    },
    [hook.createService]
  );

  const updateService = useCallback(
    async (id: string, data: VendorServiceUpdateRequest) => {
      const service = await hook.updateService(id, data);
      if (service) store.updateService(id, service);
      return service;
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
