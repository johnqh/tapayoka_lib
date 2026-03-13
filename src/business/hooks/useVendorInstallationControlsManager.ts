import { useCallback, useEffect } from 'react';
import type { NetworkClient } from '@sudobility/types';
import type {
  VendorInstallationControlCreateRequest,
  VendorInstallationControlUpdateRequest,
} from '@sudobility/tapayoka_types';
import { useVendorInstallationControls } from '@sudobility/tapayoka_client';
import { useVendorInstallationControlsStore } from '../stores';
import type { FirebaseIdToken } from '@sudobility/tapayoka_client';

export const useVendorInstallationControlsManager = (
  networkClient: NetworkClient,
  baseUrl: string,
  entitySlug: string | null,
  token: FirebaseIdToken | null,
  installationId: string | null
) => {
  const store = useVendorInstallationControlsStore();
  const hook = useVendorInstallationControls(
    networkClient,
    baseUrl,
    entitySlug,
    token,
    installationId,
    { enabled: !!token && !!installationId }
  );

  useEffect(() => {
    store.reset();
  }, [entitySlug]);

  useEffect(() => {
    if (hook.controls.length > 0 && installationId) {
      store.setControls(hook.controls, installationId, entitySlug ?? undefined);
    }
  }, [hook.controls, installationId, entitySlug]);

  const addControl = useCallback(
    async (data: VendorInstallationControlCreateRequest) => {
      const control = await hook.createControl(data);
      if (control) store.addControl(control);
      return control;
    },
    [hook.createControl]
  );

  const updateControl = useCallback(
    async (id: string, data: VendorInstallationControlUpdateRequest) => {
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
