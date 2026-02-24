import { describe, it, expect, beforeEach } from 'vitest';
import { useOrdersStore } from '../business/stores/useOrdersStore';
import type { OrderDetailed } from '@sudobility/tapayoka_types';

const mockOrder = (id: string, status = 'PAID' as const): OrderDetailed => ({
  id,
  deviceWalletAddress: '0xabc',
  serviceId: 'svc-1',
  buyerUid: 'user-1',
  amountCents: 200,
  authorizedSeconds: 1800,
  status,
  stripePaymentIntentId: null,
  createdAt: null,
  updatedAt: null,
  deviceLabel: 'Device 1',
  serviceName: 'Wash',
  serviceType: 'FIXED',
});

describe('useOrdersStore', () => {
  beforeEach(() => {
    useOrdersStore.getState().reset();
  });

  it('starts empty', () => {
    const state = useOrdersStore.getState();
    expect(state.orders).toEqual([]);
    expect(state.isLoaded).toBe(false);
  });

  it('setOrders sets data and marks loaded', () => {
    const orders = [mockOrder('o1'), mockOrder('o2', 'DONE')];
    useOrdersStore.getState().setOrders(orders);
    const state = useOrdersStore.getState();
    expect(state.orders).toHaveLength(2);
    expect(state.isLoaded).toBe(true);
  });

  it('reset clears state', () => {
    useOrdersStore.getState().setOrders([mockOrder('o1')]);
    useOrdersStore.getState().reset();
    const state = useOrdersStore.getState();
    expect(state.orders).toEqual([]);
    expect(state.isLoaded).toBe(false);
  });
});
