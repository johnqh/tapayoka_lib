import type { NetworkClient } from '@sudobility/types';
import type { DailySchedule, DayOfWeek } from '@sudobility/tapayoka_types';
import type { FirebaseIdToken } from '@sudobility/tapayoka_client';
import { useVendorOfferingsManager } from './useVendorOfferingsManager';

/**
 * Business hook for managing a single offering's weekly schedule as a list of
 * day entries (one entry per `dayOfWeek`).
 *
 * Owns the add/update/remove-within-array logic and persists changes through
 * the offerings manager's `updateOffering` (which PUTs the whole `schedule`
 * array). Keeps this logic out of the UI so web and RN share it.
 */
export const useOfferingScheduleManager = (
  networkClient: NetworkClient,
  baseUrl: string,
  entitySlug: string | null,
  token: FirebaseIdToken | null,
  parentId: string | null,
  parentType: 'location' | 'model',
  offeringId: string | null
) => {
  const offerings = useVendorOfferingsManager(
    networkClient,
    baseUrl,
    entitySlug,
    token,
    parentId,
    parentType
  );

  const offering = offerings.offerings.find(o => o.id === offeringId) ?? null;
  const schedule = offering?.schedule ?? [];

  const persist = (next: DailySchedule[]) =>
    offeringId
      ? offerings.updateOffering(offeringId, {
          schedule: next.length > 0 ? next : null,
        })
      : Promise.resolve(null);

  const addEntry = (entry: DailySchedule) => persist([...schedule, entry]);

  const updateEntry = (dayOfWeek: DayOfWeek, entry: DailySchedule) =>
    persist(schedule.map(s => (s.dayOfWeek === dayOfWeek ? entry : s)));

  const removeEntry = (dayOfWeek: DayOfWeek) =>
    persist(schedule.filter(s => s.dayOfWeek !== dayOfWeek));

  return {
    offering,
    schedule,
    isLoading: offerings.isLoading,
    error: offerings.error,
    refresh: offerings.refresh,
    addEntry,
    updateEntry,
    removeEntry,
    clearError: offerings.clearError,
  };
};
