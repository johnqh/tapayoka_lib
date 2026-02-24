import { describe, it, expect, beforeEach } from 'vitest';
import { useDevicesStore } from '../business/stores/useDevicesStore';
import type { Device } from '@sudobility/tapayoka_types';

const mockDevice = (addr: string): Device => ({
  walletAddress: addr,
  entityId: 'entity-1',
  label: `Device ${addr}`,
  model: null,
  location: null,
  gpioConfig: null,
  status: 'ACTIVE',
  serverWalletAddress: null,
  createdAt: null,
  updatedAt: null,
});

describe('useDevicesStore', () => {
  beforeEach(() => {
    useDevicesStore.getState().reset();
  });

  it('starts empty', () => {
    const state = useDevicesStore.getState();
    expect(state.devices).toEqual([]);
    expect(state.isLoaded).toBe(false);
    expect(state.entitySlug).toBeNull();
  });

  it('setDevices sets devices and marks loaded', () => {
    const devices = [mockDevice('0x01'), mockDevice('0x02')];
    useDevicesStore.getState().setDevices(devices, 'my-entity');
    const state = useDevicesStore.getState();
    expect(state.devices).toHaveLength(2);
    expect(state.isLoaded).toBe(true);
    expect(state.entitySlug).toBe('my-entity');
  });

  it('addDevice appends to list', () => {
    useDevicesStore.getState().setDevices([mockDevice('0x01')], 'e');
    useDevicesStore.getState().addDevice(mockDevice('0x02'));
    expect(useDevicesStore.getState().devices).toHaveLength(2);
  });

  it('updateDevice updates matching device', () => {
    useDevicesStore.getState().setDevices([mockDevice('0x01'), mockDevice('0x02')], 'e');
    useDevicesStore.getState().updateDevice('0x01', { label: 'Updated' });
    const devices = useDevicesStore.getState().devices;
    expect(devices[0].label).toBe('Updated');
    expect(devices[1].label).toBe('Device 0x02');
  });

  it('updateDevice ignores non-matching address', () => {
    useDevicesStore.getState().setDevices([mockDevice('0x01')], 'e');
    useDevicesStore.getState().updateDevice('0x99', { label: 'Nope' });
    expect(useDevicesStore.getState().devices[0].label).toBe('Device 0x01');
  });

  it('removeDevice removes matching device', () => {
    useDevicesStore.getState().setDevices([mockDevice('0x01'), mockDevice('0x02')], 'e');
    useDevicesStore.getState().removeDevice('0x01');
    const devices = useDevicesStore.getState().devices;
    expect(devices).toHaveLength(1);
    expect(devices[0].walletAddress).toBe('0x02');
  });

  it('reset clears state', () => {
    useDevicesStore.getState().setDevices([mockDevice('0x01')], 'e');
    useDevicesStore.getState().reset();
    const state = useDevicesStore.getState();
    expect(state.devices).toEqual([]);
    expect(state.isLoaded).toBe(false);
    expect(state.entitySlug).toBeNull();
  });
});
