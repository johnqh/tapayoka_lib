import { useEffect } from 'react';
import type { NetworkClient } from '@sudobility/types';
import { useOrders } from '@sudobility/tapayoka_client';
import { useOrdersStore } from '../stores';
import type { FirebaseIdToken } from '@sudobility/tapayoka_client';

export const useOrdersManager = (
  networkClient: NetworkClient,
  baseUrl: string,
  entitySlug: string | null,
  token: FirebaseIdToken | null
) => {
  const store = useOrdersStore();
  const hook = useOrders(networkClient, baseUrl, entitySlug, token);

  useEffect(() => {
    if (hook.orders.length > 0) {
      store.setOrders(hook.orders);
    }
  }, [hook.orders]);

  return {
    orders: store.isLoaded ? store.orders : hook.orders,
    isLoading: hook.isLoading,
    error: hook.error,
    refresh: hook.refresh,
    createOrder: hook.createOrder,
    processPayment: hook.processPayment,
    clearError: hook.clearError,
  };
};
