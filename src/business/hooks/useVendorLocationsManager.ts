import { useCallback, useEffect } from 'react';
import type { NetworkClient } from '@sudobility/types';
import type {
  VendorLocationCreateRequest,
  VendorLocationUpdateRequest,
} from '@sudobility/tapayoka_types';
import { useVendorLocations } from '@sudobility/tapayoka_client';
import { useVendorLocationsStore } from '../stores';
import type { FirebaseIdToken } from '@sudobility/tapayoka_client';

export const useVendorLocationsManager = (
  networkClient: NetworkClient,
  baseUrl: string,
  entitySlug: string | null,
  token: FirebaseIdToken | null
) => {
  const store = useVendorLocationsStore();
  const hook = useVendorLocations(networkClient, baseUrl, entitySlug, token, {
    enabled: !!token,
  });

  useEffect(() => {
    if (hook.locations.length > 0) {
      store.setLocations(hook.locations);
    }
  }, [hook.locations]);

  const addLocation = useCallback(
    async (data: VendorLocationCreateRequest) => {
      const location = await hook.createLocation(data);
      if (location) store.addLocation(location);
      return location;
    },
    [hook.createLocation]
  );

  const updateLocation = useCallback(
    async (id: string, data: VendorLocationUpdateRequest) => {
      const location = await hook.updateLocation(id, data);
      if (location) store.updateLocation(id, location);
      return location;
    },
    [hook.updateLocation]
  );

  const deleteLocation = useCallback(
    async (id: string) => {
      const ok = await hook.deleteLocation(id);
      if (ok) store.removeLocation(id);
      return ok;
    },
    [hook.deleteLocation]
  );

  return {
    locations: store.isLoaded ? store.locations : hook.locations,
    isLoading: hook.isLoading,
    error: hook.error,
    refresh: hook.refresh,
    addLocation,
    updateLocation,
    deleteLocation,
    clearError: hook.clearError,
  };
};
