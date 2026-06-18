import type {
  OfferingSignal,
  OfferingType,
  PricingTier,
} from '@sudobility/tapayoka_types';

export type DurationUnit = 'minutes' | 'hours';

export interface AmountAndSeconds {
  amountCents: number;
  seconds: number;
}

export interface TierAuthorizationFields {
  offeringType: OfferingType;
  signals?: OfferingSignal[];
}

export function durationUnitSeconds(unit: DurationUnit): number {
  return unit === 'hours' ? 3600 : 60;
}

export function priceStringToCents(price: string): number {
  return Math.round(Number.parseFloat(price) * 100);
}

export function tierMinCents(tier: PricingTier): number {
  return tier.type === 'fixed'
    ? priceStringToCents(tier.price)
    : priceStringToCents(tier.startPrice);
}

export function tierBaseSeconds(tier: PricingTier): number {
  if (tier.type === 'fixed') {
    return tier.signals.reduce((sum, signal) => sum + signal.duration, 0);
  }
  return tier.startDuration * durationUnitSeconds(tier.startDurationUnit);
}

export function tierStepSeconds(tier: PricingTier): number {
  if (tier.type !== 'timed') return 0;
  return tier.marginalDuration * durationUnitSeconds(tier.marginalDurationUnit);
}

export function fixedTierAmountAndSeconds(tier: PricingTier): AmountAndSeconds {
  return { amountCents: tierMinCents(tier), seconds: tierBaseSeconds(tier) };
}

export function computeFromSteps(
  tier: PricingTier,
  steps: number
): AmountAndSeconds {
  if (tier.type === 'fixed') {
    return fixedTierAmountAndSeconds(tier);
  }

  const count = Math.max(0, Math.floor(steps));
  return {
    amountCents:
      tierMinCents(tier) + count * priceStringToCents(tier.marginalPrice),
    seconds: tierBaseSeconds(tier) + count * tierStepSeconds(tier),
  };
}

export function calculateAuthorizedSeconds(
  tier: PricingTier,
  amountCents: number
): number {
  if (tier.type === 'fixed') {
    return tierBaseSeconds(tier);
  }

  const startCents = tierMinCents(tier);
  const startSeconds = tierBaseSeconds(tier);
  if (amountCents <= startCents) return startSeconds;

  const marginalCents = priceStringToCents(tier.marginalPrice);
  if (marginalCents <= 0) return startSeconds;

  const extraUnits = Math.floor((amountCents - startCents) / marginalCents);
  return startSeconds + extraUnits * tierStepSeconds(tier);
}

export function tierAuthorizationFields(
  tier: PricingTier | null | undefined
): TierAuthorizationFields {
  if (!tier) return { offeringType: 'TRIGGER' };
  if (tier.type === 'fixed') {
    return { offeringType: 'FIXED', signals: tier.signals };
  }
  return { offeringType: 'TIMED' };
}

export function formatPrice(cents: number, currency = 'USD'): string {
  if (currency === 'USD') return `$${(cents / 100).toFixed(2)}`;
  return `${currency} ${(cents / 100).toFixed(2)}`;
}

export function formatTierPrice(tier: PricingTier): string {
  return formatPrice(tierMinCents(tier), tier.currencyCode);
}

export function formatDuration(seconds: number): string {
  if (seconds <= 0) return '0 min';
  const totalMin = Math.round(seconds / 60);
  if (totalMin < 60) return `${totalMin} min`;
  const hours = Math.floor(totalMin / 60);
  const minutes = totalMin % 60;
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
}

export function formatPricingSubtitle(tiers: PricingTier[]): string {
  if (tiers.length === 0) return 'No pricing';
  const first = tiers[0];
  if (first.type === 'timed') {
    const unit = first.startDurationUnit === 'hours' ? 'hr' : 'min';
    const base = `${formatPrice(priceStringToCents(first.startPrice), first.currencyCode)} / ${first.startDuration}${unit}`;
    return tiers.length > 1 ? `${base} (+${tiers.length - 1} more)` : base;
  }

  const base = formatPrice(priceStringToCents(first.price), first.currencyCode);
  return tiers.length > 1 ? `${base} (+${tiers.length - 1} more)` : base;
}
