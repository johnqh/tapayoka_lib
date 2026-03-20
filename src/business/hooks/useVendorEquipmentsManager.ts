import { useCallback, useEffect } from 'react';
import type { NetworkClient } from '@sudobility/types';
import type {
  VendorEquipmentCreateRequest,
  VendorEquipmentUpdateRequest,
} from '@sudobility/tapayoka_types';
import { useVendorEquipments } from '@sudobility/tapayoka_client';
import { useVendorEquipmentsStore } from '../stores';
import type { FirebaseIdToken } from '@sudobility/tapayoka_client';

export const useVendorEquipmentsManager = (
  networkClient: NetworkClient,
  baseUrl: string,
  entitySlug: string | null,
  token: FirebaseIdToken | null,
  offeringId: string | null
) => {
  const store = useVendorEquipmentsStore();
  const hook = useVendorEquipments(
    networkClient,
    baseUrl,
    entitySlug,
    token,
    offeringId,
    { enabled: !!token && !!offeringId }
  );

  useEffect(() => {
    store.reset();
  }, [entitySlug]);

  useEffect(() => {
    if (hook.equipments.length > 0 && offeringId) {
      store.setEquipments(hook.equipments, offeringId, entitySlug ?? undefined);
    }
  }, [hook.equipments, offeringId, entitySlug]);

  const addEquipment = useCallback(
    async (data: VendorEquipmentCreateRequest) => {
      const equipment = await hook.createEquipment(data);
      if (equipment) store.addEquipment(equipment);
      return equipment;
    },
    [hook.createEquipment]
  );

  const updateEquipment = useCallback(
    async (walletAddress: string, data: VendorEquipmentUpdateRequest) => {
      const equipment = await hook.updateEquipment(walletAddress, data);
      if (equipment) store.updateEquipment(walletAddress, equipment);
      return equipment;
    },
    [hook.updateEquipment]
  );

  const deleteEquipment = useCallback(
    async (walletAddress: string) => {
      const ok = await hook.deleteEquipment(walletAddress);
      if (ok) store.removeEquipment(walletAddress);
      return ok;
    },
    [hook.deleteEquipment]
  );

  return {
    equipments: store.isLoaded ? store.equipments : hook.equipments,
    isLoading: hook.isLoading,
    error: hook.error,
    refresh: hook.refresh,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    clearError: hook.clearError,
  };
};
