/**
 * @fileoverview Supported currency codes.
 */

/** Currency codes offered in the vendor settings currency picker. */
export const SUPPORTED_CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'JPY',
  'CAD',
  'AUD',
  'CHF',
  'CNY',
  'KRW',
  'MXN',
  'BRL',
  'INR',
] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];
