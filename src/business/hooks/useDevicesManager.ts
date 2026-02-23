import { useCallback, useEffect } from 'react';
import type { NetworkClient } from '@sudobility/types';
import type { DeviceCreateRequest, DeviceUpdateRequest } from '@sudobility/tapayoka_types';
import { useDevices } from '@sudobility/tapayoka_client';
import { useDevicesStore } from '../stores';
import type { FirebaseIdToken } from '@sudobility/tapayoka_client';

export const useDevicesManager = (
  networkClient: NetworkClient,
  baseUrl: string,
  entitySlug: string | null,
  token: FirebaseIdToken | null
) => {
  const store = useDevicesStore();
  const hook = useDevices(networkClient, baseUrl, entitySlug, token, {
    enabled: !!token,
  });

  // Sync hook data to store
  useEffect(() => {
    if (hook.devices.length > 0 && entitySlug) {
      store.setDevices(hook.devices, entitySlug);
    }
  }, [hook.devices, entitySlug]);

  const addDevice = useCallback(
    async (data: DeviceCreateRequest) => {
      const device = await hook.createDevice(data);
      if (device) store.addDevice(device);
      return device;
    },
    [hook.createDevice]
  );

  const updateDevice = useCallback(
    async (walletAddress: string, data: DeviceUpdateRequest) => {
      const device = await hook.updateDevice(walletAddress, data);
      if (device) store.updateDevice(walletAddress, device);
      return device;
    },
    [hook.updateDevice]
  );

  const deleteDevice = useCallback(
    async (walletAddress: string) => {
      const ok = await hook.deleteDevice(walletAddress);
      if (ok) store.removeDevice(walletAddress);
      return ok;
    },
    [hook.deleteDevice]
  );

  return {
    devices: store.isLoaded ? store.devices : hook.devices,
    isLoading: hook.isLoading,
    error: hook.error,
    refresh: hook.refresh,
    addDevice,
    updateDevice,
    deleteDevice,
    clearError: hook.clearError,
  };
};
