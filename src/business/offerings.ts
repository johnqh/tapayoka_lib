/**
 * @fileoverview Offering create/naming helpers + parent-union resolution.
 */

import type {
  VendorModelPricing,
  VendorOfferingCreateRequest,
} from '@sudobility/tapayoka_types';
import { makeDefaultTier } from './pricing/tierFactories';

/** An offering's parent — either a location or a model. */
export interface OfferingParent {
  parentType: 'model' | 'location';
  parentId: string;
}

/**
 * Resolve the offering parent from route/navigation params. Throws if neither a
 * modelId nor a locationId is present.
 */
export function resolveOfferingParent(params: {
  modelId?: string;
  locationId?: string;
}): OfferingParent {
  if (params.modelId) return { parentType: 'model', parentId: params.modelId };
  if (params.locationId)
    return { parentType: 'location', parentId: params.locationId };
  throw new Error('resolveOfferingParent: no modelId or locationId in params');
}

/** Default offering name, e.g. `"Washer at Main St"`. */
export function offeringDefaultName(
  itemLabel: string,
  parentName: string
): string {
  return `${itemLabel} at ${parentName}`;
}

/**
 * Build an offering create request from a form. Maps the parent/picker ids to
 * location/model ids and seeds a single default pricing tier (from the model's
 * pricing kind) so the new offering is immediately usable.
 */
export function buildOfferingCreateRequest(input: {
  parentType: 'model' | 'location';
  parentId: string;
  pickerId: string;
  name: string;
  modelPricing: VendorModelPricing | null;
  currency?: string;
}): VendorOfferingCreateRequest {
  const vendorLocationId =
    input.parentType === 'location' ? input.parentId : input.pickerId;
  const vendorModelId =
    input.parentType === 'model' ? input.parentId : input.pickerId;
  const pricingTiers = input.modelPricing
    ? [makeDefaultTier(input.modelPricing, input.currency ?? 'USD', 'Default')]
    : [];
  return {
    vendorLocationId,
    vendorModelId,
    name: input.name.trim(),
    pricingTiers,
  };
}
