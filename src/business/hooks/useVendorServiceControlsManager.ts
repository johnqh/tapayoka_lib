import { useCallback, useEffect } from 'react';
import type { NetworkClient } from '@sudobility/types';
import type {
  VendorServiceControlCreateRequest,
  VendorServiceControlUpdateRequest,
} from '@sudobility/tapayoka_types';
import { useVendorServiceControls } from '@sudobility/tapayoka_client';
import { useVendorServiceControlsStore } from '../stores';
import type { FirebaseIdToken } from '@sudobility/tapayoka_client';

export const useVendorServiceControlsManager = (
  networkClient: NetworkClient,
  baseUrl: string,
  entitySlug: string | null,
  token: FirebaseIdToken | null,
  serviceId: string | null
) => {
  const store = useVendorServiceControlsStore();
  const hook = useVendorServiceControls(
    networkClient,
    baseUrl,
    entitySlug,
    token,
    serviceId,
    { enabled: !!token && !!serviceId }
  );

  useEffect(() => {
    if (hook.controls.length > 0 && serviceId) {
      store.setControls(hook.controls, serviceId);
    }
  }, [hook.controls, serviceId]);

  const addControl = useCallback(
    async (data: VendorServiceControlCreateRequest) => {
      const control = await hook.createControl(data);
      if (control) store.addControl(control);
      return control;
    },
    [hook.createControl]
  );

  const updateControl = useCallback(
    async (id: string, data: VendorServiceControlUpdateRequest) => {
      const control = await hook.updateControl(id, data);
      if (control) store.updateControl(id, control);
      return control;
    },
    [hook.updateControl]
  );

  const deleteControl = useCallback(
    async (id: string) => {
      const ok = await hook.deleteControl(id);
      if (ok) store.removeControl(id);
      return ok;
    },
    [hook.deleteControl]
  );

  return {
    controls: store.isLoaded ? store.controls : hook.controls,
    isLoading: hook.isLoading,
    error: hook.error,
    refresh: hook.refresh,
    addControl,
    updateControl,
    deleteControl,
    clearError: hook.clearError,
  };
};
