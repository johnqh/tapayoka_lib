/**
 * @fileoverview Device deep-link protocol (parse + build).
 * @description Pure, dependency-free serialization of the `tapayokav://connect`
 * device deep-link protocol. `buildDeviceDeepLink` and `parseDeviceDeepLink` are
 * inverses. No transport/BLE code lives here.
 */

export interface ParsedDeviceDeepLink {
  transport: 'ble' | 'ws';
  wallet: string;
  name: string;
  wsUrl?: string;
}

/** Parse a `tapayokav://connect?...` deep link, or null if malformed. */
export function parseDeviceDeepLink(url: string): ParsedDeviceDeepLink | null {
  try {
    // URL needs a real scheme; swap the custom scheme for a parseable one.
    const parsed = new URL(url.replace('tapayokav://', 'https://placeholder/'));
    const params = parsed.searchParams;
    const transport = params.get('transport');
    const wallet = params.get('wallet');
    const name = params.get('name');

    if (!transport || !wallet || !name) return null;
    if (transport !== 'ble' && transport !== 'ws') return null;

    return {
      transport,
      wallet,
      name,
      wsUrl: params.get('wsUrl') ?? undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Build a fixed (IP-free) BLE deep link for printing on a device label. `name`
 * defaults to the BLE-advertised device name the buyer's scan matches on:
 * `tapayoka-<first 8 hex of the wallet address>`.
 */
export function buildDeviceDeepLink(params: {
  wallet: string;
  name?: string;
}): string {
  const name =
    params.name ?? `tapayoka-${params.wallet.slice(2, 10).toLowerCase()}`;
  const qs = `transport=ble&wallet=${encodeURIComponent(params.wallet)}&name=${encodeURIComponent(name)}`;
  return `tapayokav://connect?${qs}`;
}
