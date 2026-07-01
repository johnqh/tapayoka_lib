import type { NetworkClient } from '@sudobility/types';
import type { PricingTier } from '@sudobility/tapayoka_types';
import type { FirebaseIdToken } from '@sudobility/tapayoka_client';
import { useVendorOfferingsManager } from './useVendorOfferingsManager';

/**
 * Business hook for managing a single offering's pricing tiers as a list.
 *
 * Owns the add/update/remove-within-array logic and persists changes through
 * the offerings manager's `updateOffering` (which PUTs the whole
 * `pricingTiers` array). Keeps this logic out of the UI so web and RN share it.
 */
export const useOfferingPricingTiersManager = (
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
  const tiers = offering?.pricingTiers ?? [];

  const persist = (next: PricingTier[]) =>
    offeringId
      ? offerings.updateOffering(offeringId, { pricingTiers: next })
      : Promise.resolve(null);

  const addTier = (tier: PricingTier) => persist([...tiers, tier]);

  const updateTier = (tierId: string, tier: PricingTier) =>
    persist(tiers.map(t => (t.id === tierId ? tier : t)));

  const removeTier = (tierId: string) =>
    persist(tiers.filter(t => t.id !== tierId));

  return {
    offering,
    tiers,
    isLoading: offerings.isLoading,
    error: offerings.error,
    refresh: offerings.refresh,
    addTier,
    updateTier,
    removeTier,
    clearError: offerings.clearError,
  };
};
