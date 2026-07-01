/**
 * @fileoverview Numeric input parsing for pricing fields.
 * @description Shared coercion of free-text numeric inputs (pin numbers,
 * durations) into integers with a domain fallback, so the web and RN apps parse
 * identically (they previously diverged: `|| 1` vs `isNaN ? 0`).
 */

/** Parse an integer from free-text input, returning `fallback` when invalid. */
export function parseIntOr(value: string, fallback: number): number {
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? fallback : n;
}
