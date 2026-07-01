/**
 * @fileoverview Fixed-tier signal helpers.
 * @description Immutable add/remove/update operations on a FixedPricingTier's
 * signals, plus the default new-signal shape. Shared by the vendor apps.
 */

import type {
  FixedPricingTier,
  OfferingSignal,
} from '@sudobility/tapayoka_types';

/** A default new signal (pin 0, 5 seconds). */
export function makeDefaultSignal(): OfferingSignal {
  return { pinNumber: 0, duration: 5 };
}

/** Return a copy of the tier with a new default signal appended. */
export function addSignal(tier: FixedPricingTier): FixedPricingTier {
  return { ...tier, signals: [...tier.signals, makeDefaultSignal()] };
}

/** Return a copy of the tier with the signal at `index` removed. */
export function removeSignal(
  tier: FixedPricingTier,
  index: number
): FixedPricingTier {
  return { ...tier, signals: tier.signals.filter((_, i) => i !== index) };
}

/** Return a copy of the tier with the signal at `index` replaced. */
export function updateSignal(
  tier: FixedPricingTier,
  index: number,
  signal: OfferingSignal
): FixedPricingTier {
  return {
    ...tier,
    signals: tier.signals.map((s, i) => (i === index ? signal : s)),
  };
}
