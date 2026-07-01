/**
 * @fileoverview Location field mapping.
 */

import type {
  VendorLocation,
  VendorLocationCreateRequest,
} from '@sudobility/tapayoka_types';

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

/** The editable fields of a vendor-location form. */
export interface VendorLocationFormFields {
  name: string;
  address: string;
  city: string;
  stateProvince: string;
  zipcode: string;
  country: string;
}

/** An empty location form (all fields blank). */
export const emptyLocationForm: VendorLocationFormFields = {
  name: '',
  address: '',
  city: '',
  stateProvince: '',
  zipcode: '',
  country: '',
};

/** Map an existing location to editable form fields. */
export function locationToFormFields(
  location: VendorLocation
): VendorLocationFormFields {
  return {
    name: location.name,
    address: location.address,
    city: location.city,
    stateProvince: location.stateProvince,
    zipcode: location.zipcode,
    country: location.country,
  };
}

/** Build a location create/update request from the form fields (trimmed). */
export function buildLocationRequest(
  fields: VendorLocationFormFields
): VendorLocationCreateRequest {
  return {
    name: fields.name.trim(),
    address: fields.address.trim(),
    city: fields.city.trim(),
    stateProvince: fields.stateProvince.trim(),
    zipcode: fields.zipcode.trim(),
    country: fields.country.trim(),
  };
}

/**
 * Whether a location form is complete enough to save. A vendor location needs a
 * full address, so all fields are required (unifies the previously divergent
 * web rule, which required only the name).
 */
export function canSaveLocation(fields: VendorLocationFormFields): boolean {
  return (
    !!fields.name.trim() &&
    !!fields.address.trim() &&
    !!fields.city.trim() &&
    !!fields.stateProvince.trim() &&
    !!fields.zipcode.trim() &&
    !!fields.country.trim()
  );
}

/**
 * Human-readable address for a location. `short` yields "City, State, Country"
 * (for list rows); the default yields the full comma-joined address.
 */
export function formatLocationAddress(
  location: Pick<
    VendorLocation,
    'address' | 'city' | 'stateProvince' | 'zipcode' | 'country'
  >,
  opts?: { short?: boolean }
): string {
  const parts = opts?.short
    ? [location.city, location.stateProvince, location.country]
    : [
        location.address,
        location.city,
        location.stateProvince,
        location.zipcode,
        location.country,
      ];
  return parts.filter(Boolean).join(', ');
}
