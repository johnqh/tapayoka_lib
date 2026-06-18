import type {
  BuyerVerifyResponse,
  PricingTier,
} from '@sudobility/tapayoka_types';

export type VerifySlot = BuyerVerifyResponse['slots'][number];

export type TierStep =
  | { screen: 'DurationAdjust'; tier: PricingTier; slot: VerifySlot | null }
  | { screen: 'Payment'; tier: PricingTier; slot: VerifySlot | null };

export type AfterSlotStep =
  | { screen: 'ServiceSelection'; slot: VerifySlot | null }
  | TierStep;

export type NextStep = { screen: 'SlotSelection' } | AfterSlotStep;

export function needsSlotStep(verify: BuyerVerifyResponse): boolean {
  return verify.slots.length > 1;
}

export function resolveServiceOptions(
  verify: BuyerVerifyResponse,
  slot: VerifySlot | null
): PricingTier[] {
  if (verify.slots.length > 1) {
    return slot?.pricingTier ? [slot.pricingTier] : [];
  }

  if (verify.offeringTiers && verify.offeringTiers.length > 0) {
    return verify.offeringTiers;
  }

  const only = verify.slots[0]?.pricingTier;
  return only ? [only] : [];
}

function stepForTier(tier: PricingTier, slot: VerifySlot | null): TierStep {
  return tier.type === 'timed'
    ? { screen: 'DurationAdjust', tier, slot }
    : { screen: 'Payment', tier, slot };
}

export function nextStepAfterService(
  tier: PricingTier,
  slot: VerifySlot | null
): TierStep {
  return stepForTier(tier, slot);
}

export function nextStepAfterSlot(
  verify: BuyerVerifyResponse,
  slot: VerifySlot | null
): AfterSlotStep | null {
  const services = resolveServiceOptions(verify, slot);
  if (services.length === 0) return null;
  if (services.length > 1) return { screen: 'ServiceSelection', slot };
  return stepForTier(services[0], slot);
}

export function initialStep(verify: BuyerVerifyResponse): NextStep | null {
  if (needsSlotStep(verify)) return { screen: 'SlotSelection' };
  return nextStepAfterSlot(verify, verify.slots[0] ?? null);
}
