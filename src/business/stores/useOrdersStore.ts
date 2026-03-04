import { create } from 'zustand';
import type { OrderDetailed } from '@sudobility/tapayoka_types';

interface OrdersState {
  orders: OrderDetailed[];
  isLoaded: boolean;
  entitySlug: string | null;
  setOrders: (orders: OrderDetailed[], entitySlug?: string) => void;
  reset: () => void;
}

export const useOrdersStore = create<OrdersState>(set => ({
  orders: [],
  isLoaded: false,
  entitySlug: null,
  setOrders: (orders, entitySlug) =>
    set({ orders, isLoaded: true, entitySlug: entitySlug ?? null }),
  reset: () => set({ orders: [], isLoaded: false, entitySlug: null }),
}));
