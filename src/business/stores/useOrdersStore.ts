import { create } from 'zustand';
import type { OrderDetailed } from '@sudobility/tapayoka_types';

interface OrdersState {
  orders: OrderDetailed[];
  isLoaded: boolean;
  setOrders: (orders: OrderDetailed[]) => void;
  reset: () => void;
}

export const useOrdersStore = create<OrdersState>(set => ({
  orders: [],
  isLoaded: false,
  setOrders: orders => set({ orders, isLoaded: true }),
  reset: () => set({ orders: [], isLoaded: false }),
}));
