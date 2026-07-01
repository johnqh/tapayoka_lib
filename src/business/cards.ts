/**
 * @fileoverview Payment-card display helpers.
 * @description Pure formatting for card brand names and expiry dates, shared so
 * every buyer surface renders the same brand casing (e.g. `unionpay` → `UnionPay`,
 * not `Unionpay`) and expiry format.
 */

/** Canonical display names for known card brands (keyed by lowercase brand). */
const CARD_BRAND_DISPLAY: Record<string, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'Amex',
  discover: 'Discover',
  diners: 'Diners Club',
  jcb: 'JCB',
  unionpay: 'UnionPay',
};

/**
 * Format a card brand for display. Known brands use their canonical name;
 * unknown brands fall back to capitalizing the first letter.
 */
export function formatCardBrand(brand: string): string {
  if (!brand) return '';
  const known = CARD_BRAND_DISPLAY[brand.toLowerCase()];
  if (known) return known;
  return brand.charAt(0).toUpperCase() + brand.slice(1);
}

/** Format a card expiry as `MM/YY`, e.g. `(3, 2027)` → `"03/27"`. */
export function formatCardExpiry(month: number, year: number): string {
  return `${String(month).padStart(2, '0')}/${String(year).slice(-2)}`;
}
