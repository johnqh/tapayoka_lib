import { useCallback, useEffect } from 'react';
import type { NetworkClient } from '@sudobility/types';
import type {
  VendorModelCreateRequest,
  VendorModelUpdateRequest,
} from '@sudobility/tapayoka_types';
import { useVendorModels } from '@sudobility/tapayoka_client';
import { useVendorModelsStore } from '../stores';
import type { FirebaseIdToken } from '@sudobility/tapayoka_client';

export const useVendorModelsManager = (
  networkClient: NetworkClient,
  baseUrl: string,
  entitySlug: string | null,
  token: FirebaseIdToken | null
) => {
  const store = useVendorModelsStore();
  const hook = useVendorModels(networkClient, baseUrl, entitySlug, token, {
    enabled: !!token,
  });

  useEffect(() => {
    store.reset();
  }, [entitySlug]);

  useEffect(() => {
    if (hook.models.length > 0 && entitySlug) {
      store.setModels(hook.models, entitySlug);
    }
  }, [hook.models, entitySlug]);

  const addModel = useCallback(
    async (data: VendorModelCreateRequest) => {
      const model = await hook.createModel(data);
      if (model) store.addModel(model);
      return model;
    },
    [hook.createModel]
  );

  const updateModel = useCallback(
    async (id: string, data: VendorModelUpdateRequest) => {
      const model = await hook.updateModel(id, data);
      if (model) store.updateModel(id, model);
      return model;
    },
    [hook.updateModel]
  );

  const deleteModel = useCallback(
    async (id: string) => {
      const ok = await hook.deleteModel(id);
      if (ok) store.removeModel(id);
      return ok;
    },
    [hook.deleteModel]
  );

  return {
    models: store.isLoaded ? store.models : hook.models,
    isLoading: hook.isLoading,
    error: hook.error,
    refresh: hook.refresh,
    addModel,
    updateModel,
    deleteModel,
    clearError: hook.clearError,
  };
};
