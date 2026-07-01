/**
 * @fileoverview Location field mapping.
 */

import type { VendorLocationCreateRequest } from '@sudobility/tapayoka_types';

/** A reverse-geocode result (subset of expo-location's LocationGeocodedAddress). */
export interface ReverseGeocodeAddress {
  street?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
}

/**
 * Map a reverse-geocode result to vendor-location address fields. Only defined
 * fields are included, so callers can spread the result over existing state.
 */
export function mapReverseGeocodeToLocationFields(
  geo: ReverseGeocodeAddress
): Partial<
  Pick<
    VendorLocationCreateRequest,
    'address' | 'city' | 'stateProvince' | 'zipcode' | 'country'
  >
> {
  const fields: Partial<
    Pick<
      VendorLocationCreateRequest,
      'address' | 'city' | 'stateProvince' | 'zipcode' | 'country'
    >
  > = {};
  if (geo.street) fields.address = geo.street;
  if (geo.city) fields.city = geo.city;
  if (geo.region) fields.stateProvince = geo.region;
  if (geo.postalCode) fields.zipcode = geo.postalCode;
  if (geo.country) fields.country = geo.country;
  return fields;
}
