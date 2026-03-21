import { useCallback, useEffect } from 'react';
import type { NetworkClient } from '@sudobility/types';
import type {
  VendorInstallationSlotCreateRequest,
  VendorInstallationSlotUpdateRequest,
  VendorInstallationSlotBulkCreateRequest,
} from '@sudobility/tapayoka_types';
import { useVendorInstallationSlots } from '@sudobility/tapayoka_client';
import { useVendorInstallationSlotsStore } from '../stores';
import type { FirebaseIdToken } from '@sudobility/tapayoka_client';

export const useVendorInstallationSlotsManager = (
  networkClient: NetworkClient,
  baseUrl: string,
  entitySlug: string | null,
  token: FirebaseIdToken | null,
  installationWalletAddress: string | null
) => {
  const store = useVendorInstallationSlotsStore();
  const hook = useVendorInstallationSlots(
    networkClient,
    baseUrl,
    entitySlug,
    token,
    installationWalletAddress,
    { enabled: !!token && !!installationWalletAddress }
  );

  useEffect(() => {
    store.reset();
  }, [entitySlug, installationWalletAddress]);

  useEffect(() => {
    if (hook.slots.length > 0 && installationWalletAddress) {
      store.setSlots(hook.slots, installationWalletAddress);
    }
  }, [hook.slots, installationWalletAddress]);

  const addSlot = useCallback(
    async (data: VendorInstallationSlotCreateRequest) => {
      const slot = await hook.createSlot(data);
      if (slot) store.addSlot(slot);
      return slot;
    },
    [hook.createSlot]
  );

  const bulkCreateSlots = useCallback(
    async (data: VendorInstallationSlotBulkCreateRequest) => {
      const slots = await hook.bulkCreateSlots(data);
      if (slots) {
        store.clearSlots();
        store.setSlots(slots, installationWalletAddress!);
      }
      return slots;
    },
    [hook.bulkCreateSlots, installationWalletAddress]
  );

  const updateSlot = useCallback(
    async (slotId: string, data: VendorInstallationSlotUpdateRequest) => {
      const slot = await hook.updateSlot(slotId, data);
      if (slot) store.updateSlot(slotId, slot);
      return slot;
    },
    [hook.updateSlot]
  );

  const deleteSlot = useCallback(
    async (slotId: string) => {
      const ok = await hook.deleteSlot(slotId);
      if (ok) store.removeSlot(slotId);
      return ok;
    },
    [hook.deleteSlot]
  );

  const deleteAllSlots = useCallback(async () => {
    const ok = await hook.deleteAllSlots();
    if (ok) store.clearSlots();
    return ok;
  }, [hook.deleteAllSlots]);

  return {
    slots: store.isLoaded ? store.slots : hook.slots,
    isLoading: hook.isLoading,
    error: hook.error,
    refresh: hook.refresh,
    addSlot,
    bulkCreateSlots,
    updateSlot,
    deleteSlot,
    deleteAllSlots,
    clearError: hook.clearError,
  };
};
