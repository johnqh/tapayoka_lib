/**
 * @fileoverview Pricing-tier factory functions.
 * @description Pure helpers that build default `PricingTier` objects. Shared by
 * the vendor apps so default pricing values live in one place (business logic),
 * not duplicated in each UI.
 */

import type {
  VendorModelPricing,
  TimedPricingTier,
  FixedPricingTier,
  PricingTier,
} from '@sudobility/tapayoka_types';

let nextTierId = 1;

/** Generate a client-side unique id for a pricing tier. */
export function generateTierId(): string {
  return `tier_${Date.now()}_${nextTierId++}`;
}

/** Build a default variable (time-based) pricing tier. */
export function makeDefaultVariableTier(
  currency: string,
  name: string
): TimedPricingTier {
  return {
    type: 'timed',
    id: generateTierId(),
    name,
    currencyCode: currency,
    startPrice: '1.00',
    startDuration: 30,
    startDurationUnit: 'minutes',
    marginalPrice: '0.50',
    marginalDuration: 15,
    marginalDurationUnit: 'minutes',
    pinNumber: 0,
  };
}

/** Build a default fixed-price pricing tier. */
export function makeDefaultFixedTier(
  currency: string,
  name: string
): FixedPricingTier {
  return {
    type: 'fixed',
    id: generateTierId(),
    name,
    currencyCode: currency,
    price: '5.00',
    signals: [{ pinNumber: 0, duration: 5 }],
  };
}

/** Build a default tier matching the model's pricing kind. */
export function makeDefaultTier(
  pricingType: VendorModelPricing,
  currency: string,
  name: string
): PricingTier {
  return pricingType === 'variable'
    ? makeDefaultVariableTier(currency, name)
    : makeDefaultFixedTier(currency, name);
}
