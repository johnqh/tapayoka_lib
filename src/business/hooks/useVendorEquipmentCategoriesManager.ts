import { useCallback, useEffect } from 'react';
import type { NetworkClient } from '@sudobility/types';
import type {
  VendorEquipmentCategoryCreateRequest,
  VendorEquipmentCategoryUpdateRequest,
} from '@sudobility/tapayoka_types';
import { useVendorEquipmentCategories } from '@sudobility/tapayoka_client';
import { useVendorEquipmentCategoriesStore } from '../stores';
import type { FirebaseIdToken } from '@sudobility/tapayoka_client';

export const useVendorEquipmentCategoriesManager = (
  networkClient: NetworkClient,
  baseUrl: string,
  entitySlug: string | null,
  token: FirebaseIdToken | null
) => {
  const store = useVendorEquipmentCategoriesStore();
  const hook = useVendorEquipmentCategories(
    networkClient,
    baseUrl,
    entitySlug,
    token,
    { enabled: !!token }
  );

  useEffect(() => {
    if (hook.categories.length > 0) {
      store.setCategories(hook.categories);
    }
  }, [hook.categories]);

  const addCategory = useCallback(
    async (data: VendorEquipmentCategoryCreateRequest) => {
      const category = await hook.createCategory(data);
      if (category) store.addCategory(category);
      return category;
    },
    [hook.createCategory]
  );

  const updateCategory = useCallback(
    async (id: string, data: VendorEquipmentCategoryUpdateRequest) => {
      const category = await hook.updateCategory(id, data);
      if (category) store.updateCategory(id, category);
      return category;
    },
    [hook.updateCategory]
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      const ok = await hook.deleteCategory(id);
      if (ok) store.removeCategory(id);
      return ok;
    },
    [hook.deleteCategory]
  );

  return {
    categories: store.isLoaded ? store.categories : hook.categories,
    isLoading: hook.isLoading,
    error: hook.error,
    refresh: hook.refresh,
    addCategory,
    updateCategory,
    deleteCategory,
    clearError: hook.clearError,
  };
};
